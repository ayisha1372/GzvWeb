// =============================================
//  GAZVA — Shared Nav & Footer Injector
// =============================================


(function () {
  // Inject Navbar
  const navHTML = `
  <nav class="navbar">
    <div class="nav-brand">
      <div class="nav-logo">
        <img src="gazvalogo.png" alt="Gazva Logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="nav-logo-placeholder" style="display:none">Logo</div>
      </div>
      <span class="nav-name">Gazva</span>
    </div>
    <ul class="nav-links">
      <li><a href="home.html">Home</a></li>
      <li><a href="core.html">Core</a></li>
      <li><a href="wings.html">Wings</a></li>
      <li><a href="department.html">Departments</a></li>
      <li><a href="gallery.html">Events</a></li>
      <li><a href="rankings.html">Rankings</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="https://gazva-blog.example.com" target="_blank" class="nav-blog-btn">Blog ↗</a></li>
    </ul>
    <div class="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </div>
  </nav>`;


  // Inject Footer
  const footerHTML = `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo-wrap">
          <div class="footer-logo-img">
            <img src="gazvalogo.png" alt="Gazva" onerror="this.style.display='none'">
          </div>
          <div>
            <div class="footer-union-name">Gazva</div>
          </div>
        </div>
        <div class="footer-sub">Students Union of Fathima Zahra Islamic Women's College</div>
        <p class="footer-desc">Empowering students through leadership, culture, and academic excellence since 2013.</p>
      </div>


      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="home.html">Home</a></li>
          <li><a href="core.html">Core Committee</a></li>
          <li><a href="wings.html">Wings</a></li>
          <li><a href="department.html">Departments</a></li>
          <li><a href="gallery.html">Events</a></li>
          <li><a href="rankings.html">Rankings</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="https://gazva-blog.example.com" target="_blank">Blog</a></li>
        </ul>
      </div>


      <div class="footer-col footer-contact">
        <h4>Contact Us</h4>
        <p>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Fathima Zahra Islamic Women's College, Chemmad, Malappuram, Kerala - 676306 <br>
          Run by Darul Huda Islamic University, Chemmad. <br>


        </p>
        <p>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <a href="mailto:gazvafathimazahra@gmail.com">gazvafathimazahra@gmail.com</a>
        </p>
        <div class="social-icons">
          <a href="https://www.instagram.com/gazvafathimazahra/" class="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.facebook.com/p/Fathima-Zahra-Islamic-Womens-College-Chemmad-Students-Union-GAZVA-100071198438474/" class="social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://wa.me/919876543210" class="social-icon" aria-label="WhatsApp">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>          </a>
          <a href="#" class="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95 29 29 0 00.46-5.25 29 29 0 00-.46-5.48z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Gazva. All rights reserved.</span>
      <span>Made with <strong style="color:rgba(255,255,255,0.5)">Gazva Media</a></strong></span>
    </div>
  </footer>`;


  // Insert into page
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', navHTML);
  body.insertAdjacentHTML('beforeend', footerHTML);
})();
