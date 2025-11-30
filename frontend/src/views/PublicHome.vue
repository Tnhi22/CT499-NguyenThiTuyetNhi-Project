<template>
  <div class="public-home">
    <!-- Categories / Quotes Section -->
    <div class="categories-section mb-5">
      <!-- Quotes Carousel -->
      <!-- Quotes Carousel (Hero style) -->
      <div
        id="quoteCarousel"
        class="carousel slide my-5 quote-hero-carousel"
        data-bs-ride="carousel"
        data-bs-interval="4000"
        data-bs-pause="false"
      >
        <div class="carousel-inner">
          <!-- Slide 1 -->
          <div class="carousel-item active">
            <div class="quote-hero-slide">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80"
                alt="Reading"
                class="quote-hero-img"
              />
              <div class="quote-hero-overlay"></div>
              <div class="quote-hero-content">
                <p class="quote-hero-text">
                  “Sách là người thầy vĩ đại nhất, mở ra cả thế giới trong từng
                  trang giấy.”
                </p>
                <span class="quote-hero-author">— Albert Einstein</span>
              </div>
            </div>
          </div>

          <!-- Slide 2 -->
          <div class="carousel-item">
            <div class="quote-hero-slide">
              <img
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80"
                alt="Library"
                class="quote-hero-img"
              />
              <div class="quote-hero-overlay"></div>
              <div class="quote-hero-content">
                <p class="quote-hero-text">
                  “Một phòng không sách giống như một cơ thể không linh hồn.”
                </p>
                <span class="quote-hero-author">— Cicero</span>
              </div>
            </div>
          </div>

          <!-- Slide 3 -->
          <div class="carousel-item">
            <div class="quote-hero-slide">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                alt="Research"
                class="quote-hero-img"
              />
              <div class="quote-hero-overlay"></div>
              <div class="quote-hero-content">
                <p class="quote-hero-text">
                  “Đọc sách là cách tốt nhất để du hành thời gian.”
                </p>
                <span class="quote-hero-author">— Francis Bacon</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#quoteCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#quoteCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>

      <!-- Categories -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="fas fa-tags text-primary me-2"></i>
          Các nhà xuất bản
        </h2>
        <router-link to="/categories" class="btn btn-outline-primary">
          <i class="fas fa-eye me-1"></i> Xem tất cả
        </router-link>
      </div>

      <div class="row g-4" v-if="categories.length > 0">
        <div
          v-for="category in categories.slice(0, 6)"
          :key="category.id"
          class="col-md-6 col-lg-4"
        >
          <div
            class="card h-100 shadow-sm border-0 category-card"
            @click="viewCategory(category.id)"
          >
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div
                  class="category-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                >
                  <i class="fas fa-book"></i>
                </div>
                <div>
                  <h5 class="card-title mb-1">{{ category.TenNhaXuatBan }}</h5>
                  <small class="text-muted">
                    <i class="fas fa-book-open me-1"></i>
                    {{ category.SoSach || 0 }} sách
                  </small>
                </div>
              </div>
              <p class="card-text text-muted mb-3" v-if="category.DiaChi">
                {{ category.DiaChi }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="fas fa-tags fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">Chưa có thể loại nào</h5>
      </div>
    </div>

    <!-- New Books Section -->
    <div class="new-books-section mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="fas fa-star text-warning me-2"></i>
          Sách mới nhất
        </h2>
        <router-link to="/books" class="btn btn-outline-primary">
          <i class="fas fa-eye me-1"></i> Xem tất cả
        </router-link>
      </div>

      <div class="row g-4" v-if="newBooks.length > 0">
        <div
          v-for="book in newBooks.slice(0, 8)"
          :key="book.MaSach"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <div
            class="card h-100 shadow-sm border-0 book-card"
            @click="viewBook(book.MaSach)"
          >
            <div class="position-relative">
              <img
                src="/images/dacnhantam.jpg"
                class="card-img-top book-thumb"
                :alt="book.TenSach"
              />
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">Mới</span>
              </div>
              <div
                class="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2"
              >
                <small class="text-xs">
                  <i class="fas fa-book me-1"></i> {{ book.SoQuyen }} quyển
                </small>
              </div>
            </div>
            <div class="card-body p-2">
              <h6 class="card-title text-dark fw-semibold mb-1 text-truncate">
                {{ book.TenSach }}
              </h6>
              <p class="card-text text-muted small mb-1">{{ book.NguonGoc }}</p>
              <p class="card-text text-primary small mb-0">
                <strong>{{ formatPrice(book.DonGia) }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="fas fa-book fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">Chưa có sách nào</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";

export default {
  name: "PublicHome",
  setup() {
    const showLoginButton = ref(true);
    const router = useRouter();
    const categories = ref([]);
    const newBooks = ref([]);

    // Ẩn nút khi click
    const hideLoginButton = () => {
      showLoginButton.value = false;
    };

    // Load dữ liệu
    const loadCategories = async () => {
      try {
        const res = await axios.get("/nhaxuatban?limit=6");
        categories.value = res.data.data.nhaxuatban || [];
      } catch (err) {
        console.error(err);
      }
    };

    const loadNewBooks = async () => {
      try {
        const res = await axios.get(
          "/sach?limit=8&sortBy=createdAt&sortOrder=desc"
        );
        newBooks.value = res.data.data || [];
      } catch (err) {
        console.error(err);
      }
    };

    const viewCategory = (id) =>
      router.push({ name: "CategoryBooks", params: { id } });
    const viewBook = (id) =>
      router.push({ name: "BookDetail", params: { id } });
    const formatPrice = (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);

    onMounted(() => {
      // Kiểm tra login
      if (localStorage.getItem("loggedIn") === "true") {
        showLoginButton.value = false;
      }

      loadCategories();
      loadNewBooks();
    });

    return {
      showLoginButton,
      hideLoginButton,
      categories,
      newBooks,
      viewCategory,
      viewBook,
      formatPrice,
    };
  },
};
</script>

<style>
@import "@/assets/styles/pages/home.css";
</style>
