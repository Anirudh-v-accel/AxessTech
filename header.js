class MyHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <!-- Start Header Area -->
        <header class="ep-header ep-header--style2 position-relative">
          <div class="animated-text">100&percnt; Placement Assistance</div>
          <!-- Header Middle -->
          <div id="active-sticky" class="ep-header__middle ep-header__middle--style2" >
            <div class="container ep-container">
              <div class="ep-header__inner ep-header__inner--style2">
                <div class="row align-items-center">
                  <div class="col-lg-2 col-6">
                    <div class="ep-logo">
                      <a href="index.html">
                        <img src="assets/logo/logo.png" alt="logo" />
                      </a>
                    </div>
                  </div>
                  <div class="col-lg-10 col-6">
                    <div class="ep-header__inner-right">
                      <nav class="ep-header__navigation">
                        <ul class="ep-header__menu ep-header__menu--style2">
                          <li>
                            <a href="index.html">Home</a>
                          </li>
                          <li>
                            <a href="about.html">About Us</a>
                          </li>
                          <li>
                            <a href="placement-guaranteed-program.html">Placement Assistance Program</a>
                          </li>
                          <li>
                            <a href="#">Support Services<i class="fi fi-ss-angle-small-down"></i></a>
                            <ul class="sub-menu">
                              <li><a href="interview-support.html">Interview Support</a></li>
                              <li><a href="job-support.html">Job Support</a></li>
                              <li><a href="career-consultation.html">Career Consultation</a></li>
                            </ul>
                          </li>
                          <li><a href="https://axesstechnology.in/blog/">Blog</a></li>
                          <li><a href="blog-2.html">Blog 2</a></li>
                          <li><a href="contact.html">Contact</a></li>
                        </ul>
                      </nav>
                      
                    </div>
                    <!-- Mobile Menu Button -->
                    <button type="button" class="mobile-menu-offcanvas-toggler" data-bs-toggle="modal" data-bs-target="#offcanvas-modal">
                      <span class="line"></span>
                      <span class="line"></span>
                      <span class="line"></span>
                    </button>
                    <!-- End Mobile Menu Button -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <!-- End Header Area -->
      `;
  
      // Call the function to set active menu item
      this.setActiveMenuItem();
    }
  
    setActiveMenuItem() {
      const currentPage = window.location.pathname.split("/").pop(); // Get the current page name
      const menuItems = this.querySelectorAll(".ep-header__menu a"); // Select all menu links

      menuItems.forEach(item => {
        const href = item.getAttribute("href"); // Get the href of each menu item
        const isBlog2 = href === 'blog-2.html' && (currentPage.includes('blog-2'));
        if (href === currentPage || isBlog2) {
          item.parentElement.classList.add("active"); // Add 'active' class to the parent <li>
        } else {
          item.parentElement.classList.remove("active"); // Remove 'active' class if it's not the current page
        }
      });
    }
  }
  
  customElements.define("my-header", MyHeader);
  