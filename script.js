let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// SLIDER PRINCIPAL ---------------------------------------------
function moveSlide(step) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + step + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

// MENU MOBILE ----------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu li a');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});

// DEPOIMENTOS / CARROSSEL ----------------------------------------
const testimonials = document.querySelectorAll('.testimonial');
let testimonialIndex = 0;

function showTestimonial(index) {
  if (!testimonials.length) return;

  testimonials.forEach((t, i) => {
    // só deixa visível o depoimento atual
    if (i === index) {
      t.style.display = 'block';
    } else {
      t.style.display = 'none';
    }
  });
}

// Inicializa depoimentos
if (testimonials.length) {
  showTestimonial(testimonialIndex);

  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
  }, 3000);
}



// BOTÃO VOLTAR AO TOPO -------------------------------------------
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backToTopButton) return;

  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ------------------------------------------
// AVALIAÇÕES - FIRESTORE (Firebase Modular)
// ------------------------------------------
const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

async function loadReviews() {
  if (!reviewsList) return;

  reviewsList.innerHTML = "<p>Carregando avaliações...</p>";

  const q = window.query(
    window.collection(window.db, "reviews"),
    window.orderBy("createdAt", "desc")
  );

  const snapshot = await window.getDocs(q);

  reviewsList.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const date = data.createdAt.toDate().toLocaleDateString("pt-BR");

    const item = document.createElement("div");
    item.classList.add("review-item");

    item.innerHTML = `
      <h4>${data.name}</h4>
      <p>${data.message}</p>
      <span class="review-date">${date}</span>
    `;

    reviewsList.appendChild(item);
  });
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const message = document.getElementById("reviewMessage").value;

    await window.addDoc(window.collection(window.db, "reviews"), {
      name,
      message,
      createdAt: new Date()
    });

    reviewForm.reset();
    alert("Avaliação enviada! Obrigado ❤️");

    loadReviews();
  });
}

loadReviews();
