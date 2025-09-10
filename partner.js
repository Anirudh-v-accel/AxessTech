class MyPartner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <!-- Start Header Area -->
   <div class="ep-brand section-gap pt-0 wow fadeInUp" data-wow-delay=".3s" data-wow-duration="3s">
      <div class="ep-section-head clientTitle">
              <h3 class="ep-section-head__big-title ep-split-text left pt-4">
              Proud <span> Member Of</span> <br />
              </h3>
          </div>
          <div class="container ep-container">
            <div class="row">
              <div class="col-12">
                <div class="owl-carousel ep-brand__slider">
                  <!-- Single Brand -->
                  <p href="#" class="ep-partner__logo">
                    <img src="assets/images/partners/nasscom1.png" alt="brand-logo" />
                  </p>
                  <!-- Single Brand -->
                  <p href="#" class="ep-partner__logo">
                    <img src="assets/images/partners/nsdc.png" alt="brand-logo" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  <!-- End Header Area --> `;
   // Now that the content is in the DOM, apply GSAP animations
   var st = $(".ep-split-text");
   if (st.length == 0) return;
   gsap.registerPlugin(SplitText);
   st.each(function (index, el) {
     el.split = new SplitText(el, {
       type: "lines,words,chars",
       linesClass: "tp-split-line",
     });
     gsap.set(el, { perspective: 400 });
     if ($(el).hasClass("right")) {
       gsap.set(el.split.chars, {
         opacity: 0,
         x: "50",
         ease: "Back.easeOut",
       });
     }
     if ($(el).hasClass("left")) {
       gsap.set(el.split.chars, {
         opacity: 0,
         x: "-50",
         ease: "circ.out",
       });
     }
     if ($(el).hasClass("up")) {
       gsap.set(el.split.chars, {
         opacity: 0,
         y: "80",
         ease: "circ.out",
       });
     }
     if ($(el).hasClass("down")) {
       gsap.set(el.split.chars, {
         opacity: 0,
         y: "-80",
         ease: "circ.out",
       });
     }
     el.anim = gsap.to(el.split.chars, {
       scrollTrigger: {
         trigger: el,
         start: "top 90%",
       },
       x: "0",
       y: "0",
       rotateX: "0",
       scale: 1,
       opacity: 1,
       duration: 0.4,
       stagger: 0.02,
     });
   });
  }
}
customElements.define("my-partner", MyPartner);
