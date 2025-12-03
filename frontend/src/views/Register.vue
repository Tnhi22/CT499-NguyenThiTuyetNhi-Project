<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-7">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Đăng ký tài khoản</h2>
                <p class="text-muted">Tạo tài khoản độc giả mới</p>
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <!-- Email -->
                  <div class="col-md-12 mb-3">
                    <label for="email" class="form-label">
                      Email <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-envelope"></i>
                      </span>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        id="email"
                        placeholder="example@email.com"
                        required
                        :disabled="loading"
                      />
                    </div>
                    <small class="text-muted">
                      Mã độc giả sẽ được tự động tạo khi đăng ký
                    </small>
                  </div>
                </div>

                <div class="row">
                  <!-- Họ tên -->
                  <div class="col-md-6 mb-3">
                    <label for="hoLot" class="form-label">
                      Họ lót <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-user"></i>
                      </span>
                      <input
                        v-model="form.HoLot"
                        type="text"
                        class="form-control"
                        id="hoLot"
                        placeholder="Nguyễn Văn"
                        maxlength="50"
                        required
                        :disabled="loading"
                      />
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="ten" class="form-label">
                      Tên <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-user"></i>
                      </span>
                      <input
                        v-model="form.Ten"
                        type="text"
                        class="form-control"
                        id="ten"
                        placeholder="An"
                        maxlength="20"
                        required
                        :disabled="loading"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <!-- Ngày sinh -->
                  <div class="col-md-6 mb-3">
                    <label for="ngaySinh" class="form-label">
                      Ngày sinh <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-calendar"></i>
                      </span>
                      <input
                        v-model="form.NgaySinh"
                        type="date"
                        class="form-control"
                        id="ngaySinh"
                        :max="maxDate"
                        :min="minDate"
                        required
                        :disabled="loading"
                      />
                    </div>
                  </div>

                  <!-- Giới tính -->
                  <div class="col-md-6 mb-3">
                    <label for="phai" class="form-label">
                      Giới tính <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-venus-mars"></i>
                      </span>
                      <select
                        v-model="form.Phai"
                        class="form-select"
                        id="phai"
                        required
                        :disabled="loading"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Địa chỉ -->
                <div class="mb-3">
                  <label for="diaChi" class="form-label">
                    Địa chỉ <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <textarea
                      v-model="form.DiaChi"
                      class="form-control"
                      id="diaChi"
                      rows="2"
                      placeholder="Nhập địa chỉ đầy đủ"
                      maxlength="200"
                      required
                      :disabled="loading"
                    ></textarea>
                  </div>
                </div>

                <!-- Điện thoại -->
                <div class="mb-3">
                  <label for="dienThoai" class="form-label">
                    Số điện thoại <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-phone"></i>
                    </span>
                    <input
                      v-model="form.DienThoai"
                      type="tel"
                      class="form-control"
                      id="dienThoai"
                      placeholder="0901234567"
                      pattern="^(0|\+84)[0-9]{9,10}$"
                      title="Số điện thoại không hợp lệ"
                      required
                      :disabled="loading"
                    />
                  </div>
                </div>

                <!-- Mật khẩu -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">
                      Mật khẩu <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        placeholder="Tối thiểu 6 ký tự"
                        minlength="6"
                        required
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

                  <div class="col-md-6 mb-3">
                    <label for="confirmPassword" class="form-label">
                      Xác nhận mật khẩu <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input
                        v-model="form.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        required
                        :disabled="loading"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showConfirmPassword = !showConfirmPassword"
                        :disabled="loading"
                      >
                        <i
                          :class="
                            showConfirmPassword
                              ? 'fas fa-eye-slash'
                              : 'fas fa-eye'
                          "
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Terms -->
                <div class="mb-3 form-check">
                  <input
                    v-model="form.acceptTerms"
                    type="checkbox"
                    class="form-check-input"
                    id="acceptTerms"
                    required
                    :disabled="loading"
                  />
                  <label class="form-check-label" for="acceptTerms">
                    Tôi đồng ý với
                    <a href="#" class="text-decoration-none"
                      >điều khoản sử dụng</a
                    >
                    và
                    <a href="#" class="text-decoration-none"
                      >chính sách bảo mật</a
                    >
                  </label>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2 mb-3"
                  :disabled="loading || !isFormValid"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ loading ? "Đang đăng ký..." : "Đăng ký" }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Đã có tài khoản?
                    <router-link
                      to="/login"
                      class="text-decoration-none fw-bold"
                    >
                      Đăng nhập ngay
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="text-center mt-3">
            <router-link to="/" class="text-decoration-none text-white">
              <i class="fas fa-arrow-left me-2"></i>
              Về trang chủ
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

export default {
  name: "Register",

  setup() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();

    const form = ref({
      email: "",
      HoLot: "",
      Ten: "",
      NgaySinh: "",
      Phai: "",
      DiaChi: "",
      DienThoai: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });

    const loading = ref(false);
    const error = ref("");
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 5,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];

    const isFormValid = computed(() => {
      return (
        form.value.password === form.value.confirmPassword &&
        form.value.password.length >= 6 &&
        form.value.acceptTerms
      );
    });

    onMounted(() => {
      if (isAuthenticated.value) router.push("/");
    });

    const handleRegister = async () => {
      if (!isFormValid.value) return;

      loading.value = true;
      error.value = "";

      try {
        const userData = {
          email: form.value.email,
          HoLot: form.value.HoLot,
          Ten: form.value.Ten,
          NgaySinh: form.value.NgaySinh,
          Phai: form.value.Phai,
          DiaChi: form.value.DiaChi,
          DienThoai: form.value.DienThoai,
          password: form.value.password,
        };

        const result = await register(userData);

        if (result.success) {
          window.dispatchEvent(
            new CustomEvent("show-message", {
              detail: { message: "Đăng ký thành công!", type: "success" },
            })
          );
          router.push("/");
        } else {
          error.value = result.error || "Đăng ký thất bại";
        }
      } catch (err) {
        console.error(err);
        error.value = "Lỗi server, vui lòng thử lại";
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      showPassword,
      showConfirmPassword,
      maxDate,
      minDate,
      isFormValid,
      handleRegister,
    };
  },
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

.input-group-text {
  background: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.btn-primary {
  background: linear-gradient(45deg, #0d6efd, #6610f2);
  border: none;
  border-radius: 0.5rem;
}
</style>
