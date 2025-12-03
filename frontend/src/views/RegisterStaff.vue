<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Đăng ký nhân viên</h2>
                <p class="text-muted">Tạo tài khoản nhân viên mới</p>
              </div>

              <form @submit.prevent="handleRegister">
                <!-- Họ tên -->
                <div class="mb-3">
                  <label class="form-label">Họ tên</label>
                  <input
                    v-model="form.HoTenNV"
                    type="text"
                    class="form-control"
                    placeholder="Nhập họ tên"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Mật khẩu -->
                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <input
                      v-model="form.Password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      placeholder="Nhập mật khẩu"
                      required
                      minlength="6"
                      :disabled="loading"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                      :disabled="loading"
                    >
                      <i
                        :class="
                          showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                </div>

                <!-- Chức vụ -->
                <div class="mb-3">
                  <label class="form-label">Chức vụ</label>
                  <select
                    v-model="form.ChucVu"
                    class="form-select"
                    required
                    :disabled="loading"
                  >
                    <option disabled value="">Chọn chức vụ</option>
                    <option>Quản lý thư viện</option>
                    <option>Thủ thư</option>
                    <option>Nhân viên</option>
                    <option>Thực tập sinh</option>
                  </select>
                </div>

                <!-- Ngày sinh -->
                <div class="mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <input
                    v-model="form.NgaySinh"
                    type="date"
                    class="form-control"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Ngày vào làm -->
                <div class="mb-3">
                  <label class="form-label">Ngày vào làm</label>
                  <input
                    v-model="form.NgayVaoLam"
                    type="date"
                    class="form-control"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Địa chỉ -->
                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input
                    v-model="form.DiaChi"
                    type="text"
                    class="form-control"
                    placeholder="Nhập địa chỉ"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Số điện thoại -->
                <div class="mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input
                    v-model="form.SoDienThoai"
                    type="tel"
                    class="form-control"
                    placeholder="VD: 0912345678"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="form.Email"
                    type="email"
                    class="form-control"
                    placeholder="Nhập email"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-success w-100 py-2 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ loading ? "Đang đăng ký..." : "Đăng ký" }}
                </button>

                <!-- Back to Login -->
                <div class="text-center">
                  <router-link
                    to="/loginAdmin"
                    class="text-decoration-none fw-bold"
                  >
                    <i class="fas fa-arrow-left me-2"></i>Quay lại đăng nhập
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  HoTenNV: "",
  Password: "",
  ChucVu: "",
  NgaySinh: "",
  NgayVaoLam: "",
  DiaChi: "",
  SoDienThoai: "",
  Email: "",
});

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await axios.post("/api/nhanvien", form.value);

    if (res.data.success) {
      alert("Tạo nhân viên thành công!");
      router.push("/loginAdmin");
    } else {
      error.value = res.data.message || "Đăng ký thất bại";
    }
  } catch (err) {
    // Lấy thông báo lỗi từ validation middleware backend
    if (err.response?.data?.errors && err.response.data.errors.length) {
      error.value = err.response.data.errors.join(", ");
    } else {
      error.value =
        err.response?.data?.message || "Lỗi hệ thống, không thể tạo nhân viên";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.card {
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}

.form-control,
.form-select {
  border-left: none;
}

.btn-success {
  background: linear-gradient(45deg, #0d6efd, #6610f2);
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4);
}

.btn-success:disabled {
  transform: none;
  box-shadow: none;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control:focus,
.form-select:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}
</style>
