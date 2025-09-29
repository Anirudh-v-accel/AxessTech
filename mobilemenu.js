class MyMobileMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<!-- Mobile Menu Modal -->
<div class="modal mobile-menu-modal offcanvas-modal fade" id="offcanvas-modal">
  <div class="modal-dialog offcanvas-dialog">
    <div class="modal-content">
      <div class="modal-header offcanvas-header">
        <!-- offcanvas-logo-start -->
        <div class="offcanvas-logo">
          <a href="index.html">
            <img src="assets/logo/logo.png" alt="logo" />
          </a>
        </div>
        <!-- offcanvas-logo-end -->
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <i class="fi fi-ss-cross"></i>
        </button>
      </div>
      <div class="mobile-menu-modal-main-body">
        <!-- offcanvas-menu start -->
        <nav id="offcanvas-menu" class="navigation offcanvas-menu">
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>
              <a class="" href="about.html">About Us</a>
            </li>
            <li>
              <a class="" href="placement-guaranteed-program.html">Placement Assistance Program</a>
            </li>
            <li>
              <a class="menu-arrow" href="#">Support Services</a>
              <ul class="sub-menu">
                <li>
                  <a href="interview-support.html">Interview Support</a>
                </li>
                <li>
                  <a href="job-support.html">Job Support</a>
                </li>
                <li>
                  <a href="career-consultation.html">Carrer Consultaton</a>
                </li>
              </ul>
            </li>
      
            <li>
              <a  href="https://axesstechnology.in/blog/">Blog</a>
              
            </li>
            <!-- <li>
              <a href="blog-2.html">Blog 2</a>
            </li> -->
          </ul>
        </nav>
      </div>
    </div>
  </div>
</div>
<!-- End Mobile Menu Modal --> `;
  }
}
customElements.define("my-mobile-menu", MyMobileMenu);