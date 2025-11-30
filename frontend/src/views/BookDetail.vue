<template>
  <div class="book-detail">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Book Detail Content -->
    <div v-else-if="book" class="row">
      <!-- Book Image -->
      <div class="col-md-4 mb-4">
        <div class="book-image-container">
          <img
            src="/images/dacnhantam.jpg"
            class="card-img-top book-thumb"
            :alt="book.TenSach"
          />
          <div class="book-status mt-3">
            <span
              class="badge fs-6 px-3 py-2"
              :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
            >
              {{ book.SoQuyen > 0 ? "Còn hàng" : "Hết hàng" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Book Info -->
      <div class="col-md-8">
        <div class="book-info">
          <h1 class="book-title mb-3">{{ book.TenSach }}</h1>

          <div class="book-meta mb-4">
            <div class="row g-3">
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Mã sách:</strong>
                  <span class="ms-2">{{ book.MaSach }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Tác giả:</strong>
                  <span class="ms-2">{{ book.NguonGoc }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Nhà xuất bản:</strong>
                  <span class="ms-2">{{ book.NhaXuatBan }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Năm xuất bản:</strong>
                  <span class="ms-2">{{ book.NamXuatBan }}</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Số lượng:</strong>
                  <span class="ms-2">{{ book.SoQuyen }} quyển</span>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="meta-item">
                  <strong>Giá:</strong>
                  <span class="ms-2 text-primary fw-bold">{{
                    formatPrice(book.DonGia)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="book-actions mb-4">
            <button
              v-if="book.SoQuyen > 0"
              class="btn btn-primary btn-lg me-3"
              @click="openBorrowModal(book)"
              :disabled="submitting"
            >
              <i class="fas fa-book me-2"></i>
              {{ submitting ? "Đang gửi..." : "Mượn sách" }}
            </button>
            <button v-else class="btn btn-secondary btn-lg me-3" disabled>
              <i class="fas fa-times me-2"></i> Hết hàng
            </button>
            <button class="btn btn-outline-primary btn-lg">
              <i class="fas fa-heart me-2"></i> Yêu thích
            </button>
          </div>

          <!-- Book Description -->
          <div class="book-description">
            <h5>Mô tả</h5>
            <p class="text-muted">{{ book.MoTa || "Chưa có mô tả" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-5">
      <i class="fas fa-book fa-4x text-muted mb-4"></i>
      <h4 class="text-muted mb-3">Không tìm thấy sách</h4>
      <p class="text-muted mb-4">
        Sách bạn đang tìm không tồn tại hoặc đã bị xóa
      </p>
      <router-link to="/books" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i> Quay lại danh sách
      </router-link>
    </div>

    <!-- Related Books -->
    <div v-if="book && relatedBooks.length > 0" class="related-books mt-5">
      <h4 class="mb-4">Sách liên quan</h4>
      <div class="row g-4">
        <div
          v-for="relatedBook in relatedBooks"
          :key="relatedBook.MaSach"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <div
            class="card h-100 shadow-sm border-0 book-card"
            @click="viewBook(relatedBook.MaSach)"
          >
            <img
              :src="getBookImage(relatedBook)"
              class="card-img-top book-thumb"
              :alt="relatedBook.TenSach"
              @error="handleImageError"
            />
            <div class="card-body p-2">
              <h6 class="card-title text-dark fw-semibold mb-1 text-truncate">
                {{ relatedBook.TenSach }}
              </h6>
              <p class="card-text text-muted small mb-0">
                {{ relatedBook.NguonGoc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Borrow Modal -->
    <div v-if="showBorrowModal">
      <div class="modal-backdrop fade show"></div>
      <div
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        @click.self="closeBorrowModal"
      >
        <div class="modal-dialog modal-lg" @click.stop>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-book-reader me-2"></i> Đăng ký mượn sách
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeBorrowModal"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitBorrowRegistration">
                <div class="mb-3">
                  <label class="form-label">Tên sách</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="borrowForm.TenSach"
                    readonly
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày hẹn trả</label>
                  <input
                    type="date"
                    v-model="borrowForm.NgayHenTra"
                    class="form-control"
                    :min="tomorrow"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ghi chú</label>
                  <textarea
                    v-model="borrowForm.GhiChu"
                    class="form-control"
                  ></textarea>
                </div>
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Lưu ý:</strong> Yêu cầu mượn sách sẽ được gửi đến thư
                  viện để xem xét và phê duyệt.
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeBorrowModal"
                :disabled="submitting"
              >
                Hủy
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="submitBorrowRegistration"
                :disabled="submitting"
              >
                <i class="fas fa-paper-plane me-2"></i>
                {{ submitting ? "Đang gửi..." : "Gửi đăng ký" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import axios from "@/utils/axios";

export default {
  name: "BookDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { user } = useAuth();

    const book = ref(null);
    const relatedBooks = ref([]);
    const loading = ref(false);
    const showBorrowModal = ref(false);
    const submitting = ref(false);

    const borrowForm = ref({
      MaSach: "",
      TenSach: "",
      NgayHenTra: "",
      GhiChu: "",
    });

    const tomorrow = computed(() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().split("T")[0];
    });

    const loadBook = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`/sach/${route.params.id}`);
        book.value = response.data.data;

        if (book.value) loadRelatedBooks();
      } catch (err) {
        console.error("Error loading book:", err);
        book.value = null;
      } finally {
        loading.value = false;
      }
    };

    const loadRelatedBooks = async () => {
      try {
        const response = await axios.get("/sach", {
          params: { MaNhaXuatBan: book.value.MaNhaXuatBan, limit: 6 },
        });
        relatedBooks.value = (response.data.data.sach || [])
          .filter((b) => b.MaSach !== book.value.MaSach)
          .slice(0, 5);
      } catch (err) {
        console.error("Error loading related books:", err);
      }
    };

    const openBorrowModal = (selectedBook) => {
      borrowForm.value.MaSach = selectedBook.MaSach;
      borrowForm.value.TenSach = selectedBook.TenSach;
      borrowForm.value.NgayHenTra = "";
      borrowForm.value.GhiChu = "";
      showBorrowModal.value = true;
    };

    const closeBorrowModal = () => {
      showBorrowModal.value = false;
      borrowForm.value = {
        MaSach: "",
        TenSach: "",
        NgayHenTra: "",
        GhiChu: "",
      };
    };

    const submitBorrowRegistration = async () => {
      if (!borrowForm.value.NgayHenTra) {
        alert("Vui lòng chọn ngày hẹn trả!");
        return;
      }

      submitting.value = true;
      try {
        const requestData = {
          MaDocGia: user.value.MaDocGia,
          MaSach: borrowForm.value.MaSach,
          NgayHenTra: borrowForm.value.NgayHenTra,
          GhiChu: borrowForm.value.GhiChu,
        };

        const response = await axios.post(
          "/theodoimuonsach/register",
          requestData
        );

        if (response.data.success) {
          alert(`Đăng ký mượn sách "${borrowForm.value.TenSach}" thành công!`);
          // Cập nhật số lượng sách hiển thị
          if (book.value.SoQuyen > 0) book.value.SoQuyen--;
          closeBorrowModal();
        } else {
          alert(response.data.message || "Có lỗi xảy ra khi đăng ký");
        }
      } catch (err) {
        console.error("Error submitting borrow:", err);
        alert(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
      } finally {
        submitting.value = false;
      }
    };

    const viewBook = (bookId) => {
      router.push({ name: "BookDetail", params: { id: bookId } });
    };

    const getBookImage = (b) => b.image || "/images/book-placeholder.svg";
    const handleImageError = (e) => {
      e.target.src = "/images/book-placeholder.svg";
    };
    const formatPrice = (price) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);

    onMounted(() => loadBook());

    return {
      book,
      relatedBooks,
      loading,
      borrowForm,
      showBorrowModal,
      submitting,
      tomorrow,
      openBorrowModal,
      closeBorrowModal,
      submitBorrowRegistration,
      viewBook,
      getBookImage,
      handleImageError,
      formatPrice,
    };
  },
};
</script>

<style scoped>
.book-detail-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.book-title {
  color: #2c3e50;
  font-weight: 700;
}
.meta-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}
.meta-item:last-child {
  border-bottom: none;
}
.book-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.book-thumb {
  width: 100%; /* full container width */
  height: auto; /* giữ tỉ lệ gốc */
  object-fit: contain; /* giữ nguyên ảnh, không crop */
  border-radius: 8px; /* tuỳ chỉnh bo góc */
}

.book-actions .btn {
  min-width: 150px;
}
@media (max-width: 768px) {
  .book-actions .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .book-actions .btn:last-child {
    margin-bottom: 0;
  }
}
/* Modal styles */
.modal-backdrop {
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal.show {
  display: block !important;
}
.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}
.modal.show .modal-dialog {
  transform: none;
}
</style>
