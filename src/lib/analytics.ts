// Analytics utilities for tracking user interactions and performance

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// VibeBlogger specific tracking events
export const analytics = {
  // User actions
  userSignUp: () => trackEvent("sign_up", { method: "google" }),
  userSignIn: () => trackEvent("login", { method: "google" }),
  
  // Content creation
  sessionCreated: (sessionId: string) => 
    trackEvent("session_created", { session_id: sessionId }),
  
  postCreated: (sessionId: string, postLength: number) => 
    trackEvent("post_created", { 
      session_id: sessionId, 
      post_length: postLength 
    }),
  
  blogGenerated: (sessionId: string, model: string, wordCount: number) => 
    trackEvent("blog_generated", { 
      session_id: sessionId, 
      ai_model: model,
      word_count: wordCount 
    }),
  
  blogPublished: (blogId: string, wordCount: number) => 
    trackEvent("blog_published", { 
      blog_id: blogId, 
      word_count: wordCount 
    }),
  
  // Feature usage
  aiModelChanged: (fromModel: string, toModel: string) => 
    trackEvent("ai_model_changed", { 
      from_model: fromModel, 
      to_model: toModel 
    }),
  
  // Performance tracking
  pageLoadTime: (page: string, loadTime: number) => 
    trackEvent("page_load_time", { 
      page, 
      load_time: loadTime 
    }),
  
  // Error tracking
  errorOccurred: (error: string, page: string) => 
    trackEvent("error_occurred", { 
      error_message: error, 
      page 
    }),
  
  // Engagement
  timeOnPage: (page: string, timeSpent: number) => 
    trackEvent("time_on_page", { 
      page, 
      time_spent: timeSpent 
    }),
};

// Performance monitoring
export const performanceMonitor = {
  startTimer: (name: string) => {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  },
  
  endTimer: (name: string) => {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = window.performance.getEntriesByName(name)[0];
      if (measure) {
        analytics.pageLoadTime(name, measure.duration);
      }
    }
  },
};

// Hook for tracking page views
export const usePageTracking = () => {
  if (typeof window !== "undefined") {
    const url = window.location.pathname;
    trackPageView(url);
  }
};
