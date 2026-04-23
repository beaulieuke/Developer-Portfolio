document.addEventListener("DOMContentLoaded", () => {
  const scrollUp = document.querySelector("#scroll-up");
  const burger = document.querySelector("#burger-menu");
  const ul = document.querySelector("nav ul");
  const nav = document.querySelector("nav");
  const themeToggle = document.querySelector("#theme-toggle");

  if (scrollUp) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollUp.classList.add("visible");
      } else {
        scrollUp.classList.remove("visible");
      }
    });

    scrollUp.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }

  if (burger) {
    burger.addEventListener("click", () => {
      ul.classList.toggle("show");
      burger.classList.toggle("active");
    });
  }

  const navLink = document.querySelectorAll(".nav-link");
  navLink.forEach((link) =>
    link.addEventListener("click", () => {
      ul.classList.remove("show");
      burger.classList.remove("active");
    })
  );

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && ul.classList.contains("show")) {
      ul.classList.remove("show");
      burger.classList.remove("active");
    }
  });

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      updateThemeButton();
    });
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  
  updateThemeButton();
  
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
    
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("error")) {
          validateField(input);
        }
      });
    });
  }
});

function validateField(field) {
  const errorElement = document.getElementById(`${field.id}-error`);
  let isValid = true;
  let errorMessage = "";
  
  field.classList.remove("error");
  if (errorElement) {
    errorElement.textContent = "";
  }
  
  if (!field.value.trim()) {
    isValid = false;
    errorMessage = "This field is required";
  } else {
    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "text":
        if (field.id === "name" && field.value.trim().length < 2) {
          isValid = false;
          errorMessage = "Name must be at least 2 characters long";
        }
        if (field.id === "subject" && field.value.trim().length < 3) {
          isValid = false;
          errorMessage = "Subject must be at least 3 characters long";
        }
        break;
      case "textarea":
        if (field.value.trim().length < 10) {
          isValid = false;
          errorMessage = "Message must be at least 10 characters long";
        }
        break;
    }
  }
  
  if (!isValid) {
    field.classList.add("error");
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }
  }
  
  return isValid;
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector(".submit-btn");
  const statusElement = document.getElementById("form-status");
  
  const inputs = form.querySelectorAll("input:not([name='_gotcha']), textarea");
  let isFormValid = true;
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });
  
  if (!isFormValid) {
    showStatus("Please correct the errors above.", "error");
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Form submission failed');
    }
  })
  .then(data => {
    showStatus("Thank you for your message! I'll get back to you soon.", "success");
    form.reset();
    
    inputs.forEach(input => {
      input.classList.remove("error");
      const errorElement = document.getElementById(`${input.id}-error`);
      if (errorElement) {
        errorElement.textContent = "";
      }
    });
  })
  .catch(error => {
    showStatus("Sorry, there was an error sending your message. Please try again or contact me directly via LinkedIn.", "error");
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  });
}

function showStatus(message, type) {
  const statusElement = document.getElementById("form-status");
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
    
    if (type === "success") {
      setTimeout(() => {
        statusElement.textContent = "";
        statusElement.className = "form-status";
      }, 5000);
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const ul = document.querySelector("nav ul");
    const burger = document.querySelector("#burger-menu");
    if (ul && ul.classList.contains("show")) {
      ul.classList.remove("show");
      burger.classList.remove("active");
    }
  }
  
  if (e.key === "Tab" && document.activeElement.classList.contains("filter-btn")) {
    filterButtons.forEach(btn => btn.setAttribute("aria-selected", "false"));
    document.activeElement.setAttribute("aria-selected", "true");
  }
});

const burger = document.querySelector("#burger-menu");
if (burger) {
  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      burger.click();
      const ul = document.querySelector("nav ul");
      if (ul && ul.classList.contains("show")) {
        const firstLink = ul.querySelector(".nav-link");
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    }
  });
}

function initProjectFiltering() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");
  const projectsContainer = document.querySelector(".projects-container");

  if (filterButtons.length > 0 && projects.length > 0) {
    filterButtons.forEach(button => {
      button.setAttribute("aria-selected", button.classList.contains("active"));
      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
    });
    
    filterButtons.forEach(button => {
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });
      
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        
        filterButtons.forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
        
        const visibleProjects = [];
        let hasVisibleProjects = false;
        
        projects.forEach(project => {
          const categories = project.dataset.category.split(" ");
          
          if (filter === "all" || categories.includes(filter)) {
            project.classList.remove("hidden");
            visibleProjects.push(project);
            hasVisibleProjects = true;
          } else {
            project.classList.add("hidden");
          }
        });
        
        let noResultsMsg = document.querySelector(".no-results");
        
        if (!hasVisibleProjects) {
          if (!noResultsMsg) {
            noResultsMsg = document.createElement("div");
            noResultsMsg.className = "no-results";
            noResultsMsg.textContent = "No projects found in this category.";
            projectsContainer.appendChild(noResultsMsg);
          }
        } else if (noResultsMsg) {
          noResultsMsg.remove();
        }
        
        visibleProjects.forEach((project, index) => {
          project.style.animation = "none";
          setTimeout(() => {
            project.style.animation = `fadeIn 0.5s ease-out forwards`;
            project.style.animationDelay = `${index * 0.1}s`;
          }, 10);
        });
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectFiltering);
} else {
  initProjectFiltering();
}
