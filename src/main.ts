import './style.css'

//---------------------------------------------------------- Hide/show navbar on scroll
let lastScroll = 0;
const navbar = document.getElementById('navbar');
const navbarOffset = navbar?.offsetTop || 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Only apply fixed behavior after scrolling past the navbar's original position
  if (currentScroll >= navbarOffset) {
    navbar?.classList.add('fixed', 'top-0', 'w-full', 'z-50');
    
    if (currentScroll > lastScroll) {
      // Scrolling down
      navbar?.classList.add('-translate-y-full');
    } else {
      // Scrolling up
      navbar?.classList.remove('-translate-y-full');
    }
  } else {
    // At the top, remove fixed positioning
    navbar?.classList.remove('fixed', 'top-0', '-translate-y-full', 'w-full', 'z-50');
  }
  
  lastScroll = currentScroll;
});


//----------------------------------------------------- Carousel Animation
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('track') as HTMLElement;
  const dotsContainer = document.getElementById('dots') as HTMLElement;
  const originalSlides = Array.from(track.querySelectorAll<HTMLElement>(':scope > div'));
  const visibleCount = 4;
  const totalSlides = originalSlides.length;
  let currentPage = 0;
  let carouselAutoplayInterval: number;

  // Clone first 'visibleCount' slides and append to end for seamless loop
  originalSlides.slice(0, visibleCount).forEach(slide => {
    const clone = slide.cloneNode(true) as HTMLElement;
    track.appendChild(clone);
  });

  const allSlides = track.querySelectorAll<HTMLElement>(':scope > div');
  const totalPages = totalSlides; // One dot per original slide

  // Create dots for each original slide
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.style.transform = i === 0 ? 'scale(1.4)' : 'scale(1)';
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ' + (i === 0 ? 'bg-white/90' : 'bg-white/25');
    dot.addEventListener('click', () => {
      goToPage(i);
      resetCarouselAutoplay();
    });
    dot.addEventListener('mouseenter', () => {
      if (dot.style.transform !== 'scale(1.4)') {
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      }
    });
    dot.addEventListener('mouseleave', () => {
      if (dot.style.transform !== 'scale(1.4)') {
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
      }
    });
    dotsContainer.appendChild(dot);
  }

  function goToPage(page: number, smooth: boolean = true): void {
    const slideWidth = allSlides[0].offsetWidth + 12;
    
    if (!smooth) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    track.style.transform = `translateX(-${page * slideWidth}px)`;
    currentPage = page;
    
    // Update dots (loop the dot index)
    const dotIndex = page % totalPages;
    dotsContainer.querySelectorAll('button').forEach((d, i) => {
      const btn = d as HTMLButtonElement;
      d.className = 'w-2 h-2 rounded-full transition-colors duration-300 ' + (i === dotIndex ? 'bg-white/90' : 'bg-white/25');
      btn.style.transform = i === dotIndex ? 'scale(1.4)' : 'scale(1)';
    });

    // Handle seamless loop
    if (page >= totalSlides) {
      setTimeout(() => {
        goToPage(0, false);
      }, 500);
    } else if (page < 0) {
      setTimeout(() => {
        goToPage(totalSlides - 1, false);
      }, 500);
    }
  }

  function nextSlide(): void {
    goToPage(currentPage + 1);
  }

  function startCarouselAutoplay(): void {
    carouselAutoplayInterval = window.setInterval(nextSlide, 3000); // Change every 3 seconds
  }

  function resetCarouselAutoplay(): void {
    clearInterval(carouselAutoplayInterval);
    startCarouselAutoplay();
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentPage === 0) {
      goToPage(totalSlides - 1, false);
      setTimeout(() => goToPage(totalSlides - 2), 50);
    } else {
      goToPage(currentPage - 1);
    }
    resetCarouselAutoplay();
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    goToPage(currentPage + 1);
    resetCarouselAutoplay();
  });

  window.addEventListener('resize', () => goToPage(currentPage, false));

  // Start autoplay
  startCarouselAutoplay();
});

//-------------------------------------------------------- Parallax Animation
interface ParallaxOptions {
  speed?: number; // default 0.3
}

const createParallax = (elementId: string, options: ParallaxOptions = {}): void => {
  const el = document.getElementById(elementId) as HTMLElement | null;
  const section = el?.closest('section') as HTMLElement | null;
  const { speed = 0.3 } = options;

  if (!el || !section) return;

  window.addEventListener('scroll', (): void => {
    const rect: DOMRect = section.getBoundingClientRect();
    const scrolled: number = -rect.top;
    const rate: number = scrolled * speed;

    el.style.transform = `translateY(${rate}px)`;
  });
};
// usage
createParallax('parallax-img', { speed: 0.2});
createParallax('parallax-img-2', { speed: 0.2 });
createParallax('parallax-footer-img', { speed: 0.2 });

//-------------------------------------------------------- Fade up Animation
interface FadeUpOptions {
  duration?: number;   // ms, default 600
  delay?: number;      // ms, default 0
  distance?: number;   // px, default 40
  easing?: string;     // default 'ease-out'
}

const createFadeUp = (elementId: string, options: FadeUpOptions = {}): void => {
  const el = document.getElementById(elementId) as HTMLElement | null;
  if (!el) return;

  const {
    duration = 600,
    distance = 40,
    delay = 0,
    easing = 'ease-out',
  } = options;

  // Set initial state
  el.style.opacity = '0';
  el.style.transform = `translateY(${distance}px)`;
  el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el); // only triggers once
      }
    });
  }, { threshold: 0.1 }); // 0.1 = triggers when 10% of element is visible

  observer.observe(el);
};

// Usage
createFadeUp('drink-1', { duration: 1200, distance: 190, delay: 400 });
createFadeUp('drink-2', { duration: 1200, distance: 190, delay: 500 });
createFadeUp('drink-3', { duration: 1200, distance: 190, delay: 600 });
createFadeUp('about-us', { duration: 800, distance: 60, delay: 400 });
createFadeUp('carousel', { duration: 800, distance: 60, delay: 400 });
createFadeUp('event-carousel', { duration: 800, distance: 100, delay: 400 });

//-------------------------------------------------------- Events Slideshow
document.addEventListener('DOMContentLoaded', () => {
  const eventTrack = document.getElementById('eventTrack') as HTMLElement;
  const eventDotsContainer = document.getElementById('eventDots') as HTMLElement;
  
  if (!eventTrack || !eventDotsContainer) return;
  
  const eventImages = eventTrack.querySelectorAll<HTMLElement>('img');
  const totalEventSlides = eventImages.length;
  let currentEventSlide = 0;
  let eventAutoplayInterval: number;

  // Create dots for event slideshow
  for (let i = 0; i < totalEventSlides; i++) {
    const dot = document.createElement('button');
    dot.style.transform = i === 0 ? 'scale(1.4)' : 'scale(1)';
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ' + (i === 0 ? 'bg-white/90' : 'bg-white/25');
    dot.addEventListener('click', () => {
      goToEventSlide(i);
      resetEventAutoplay();
    });
    dot.addEventListener('mouseenter', () => {
      if (dot.style.transform !== 'scale(1.4)') {
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      }
    });
    dot.addEventListener('mouseleave', () => {
      if (dot.style.transform !== 'scale(1.4)') {
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
      }
    });
    eventDotsContainer.appendChild(dot);
  }

  function goToEventSlide(index: number): void {
    // Hide all images
    eventImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Show current image
    eventImages[index].style.opacity = '1';
    currentEventSlide = index;
    
    // Update dots
    eventDotsContainer.querySelectorAll('button').forEach((d, i) => {
      const btn = d as HTMLButtonElement;
      d.className = 'w-2 h-2 rounded-full transition-colors duration-300 ' + (i === index ? 'bg-white/90' : 'bg-white/25');
      btn.style.transform = i === index ? 'scale(1.4)' : 'scale(1)';
    });
  }

  function nextEventSlide(): void {
    const nextIndex = (currentEventSlide + 1) % totalEventSlides;
    goToEventSlide(nextIndex);
  }

  function prevEventSlide(): void {
    const prevIndex = (currentEventSlide - 1 + totalEventSlides) % totalEventSlides;
    goToEventSlide(prevIndex);
  }

  function startEventAutoplay(): void {
    eventAutoplayInterval = window.setInterval(nextEventSlide, 4000); // Change every 4 seconds
  }

  function resetEventAutoplay(): void {
    clearInterval(eventAutoplayInterval);
    startEventAutoplay();
  }

  // Button event listeners
  document.getElementById('eventPrevBtn')?.addEventListener('click', () => {
    prevEventSlide();
    resetEventAutoplay();
  });

  document.getElementById('eventNextBtn')?.addEventListener('click', () => {
    nextEventSlide();
    resetEventAutoplay();
  });

  // Start autoplay
  startEventAutoplay();
});