<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="fas fa-tags text-primary me-2"></i>
        Danh sách tất cả Nhà xuất bản
      </h2>
    </div>

    <div class="row mb-5">
      <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div class="input-group shadow-sm">
          <span class="input-group-text bg-white border-end-0">
            <i class="fas fa-search text-muted"></i>
          </span>
          <input
            type="text"
            class="form-control border-start-0 py-2"
            placeholder="Tìm kiếm Nhà xuất bản theo tên..."
            v-model="searchQuery"
            @keyup.enter="searchCategories"
          />
          <button
            class="btn btn-primary"
            type="button"
            @click="searchCategories"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải dữ liệu Nhà xuất bản...</p>
    </div>

    <div v-else-if="filteredCategories.length > 0" class="row g-4">
      <div
        v-for="category in filteredCategories"
        :key="category.MaNXB"
        class="col-sm-6 col-md-4 col-lg-3"
      >
        <div
          class="card h-100 shadow-sm border-0 category-card-list"
          @click="viewCategoryBooks(category.MaNXB)"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title mb-1 text-primary">
                {{ category.TenNhaXuatBan }}
              </h5>
              <p class="card-text text-muted small mb-2">
                <i class="fas fa-map-marker-alt me-1"></i>
                {{ category.DiaChi || "Chưa cập nhật địa chỉ" }}
              </p>
            </div>
            <div class="mt-2 pt-2 border-top">
              <span class="badge bg-secondary">
                <i class="fas fa-book-open me-1"></i>
                {{ category.SoSach || 0 }} sách
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="fas fa-box-open fa-3x text-warning mb-3"></i>
      <h5 class="text-muted">Không tìm thấy Nhà xuất bản nào.</h5>
      <p v-if="isSearching" class="text-muted">Vui lòng thử từ khóa khác.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";

export default {
  name: "Categories",
  setup() {
    const router = useRouter();
    const categories = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const isSearching = ref(false);

    // Lọc danh sách NXB dựa trên searchQuery
    const filteredCategories = computed(() => {
      if (!searchQuery.value) {
        return categories.value;
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase();
      return categories.value.filter((category) =>
        category.TenNhaXuatBan.toLowerCase().includes(lowerCaseQuery)
      );
    });

    const loadAllCategories = async () => {
      loading.value = true;
      try {
        // Gọi API mà không giới hạn limit để lấy TẤT CẢ
        const response = await axios.get("/nhaxuatban");
        // Giả sử API trả về mảng NXB trong response.data.data.nhaxuatban hoặc response.data.data
        categories.value =
          response.data.data.nhaxuatban || response.data.data || [];
      } catch (error) {
        console.error("Error loading all categories:", error);
        // Có thể đặt một thông báo lỗi ở đây
      } finally {
        loading.value = false;
        isSearching.value = false;
      }
    };

    // Hàm này sẽ không gọi lại API mà chỉ lọc trên dữ liệu đã có
    const searchCategories = () => {
      isSearching.value = searchQuery.value.trim() !== "";
      // Việc lọc sẽ tự động được xử lý bởi computed property filteredCategories
    };

    const viewCategoryBooks = (MaNXB) => {
      // Chuyển hướng đến trang danh sách sách của Nhà xuất bản này
      // Bạn cần đảm bảo có route tên là 'CategoryBooks'
      router.push({ name: "CategoryBooks", params: { id: MaNXB } });
    };

    onMounted(() => {
      loadAllCategories();
    });

    return {
      categories,
      filteredCategories,
      loading,
      searchQuery,
      isSearching,
      searchCategories,
      viewCategoryBooks,
    };
  },
};
</script>

<style scoped>
/* Thêm style cơ bản cho card để nó nổi bật hơn */
.category-card-list {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid #0d6efd !important; /* Màu xanh primary */
}

.category-card-list:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
