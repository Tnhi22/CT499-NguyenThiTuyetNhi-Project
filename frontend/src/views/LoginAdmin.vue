<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Đăng nhập nhân viên</h2>
                <p class="text-muted">Chỉ dành cho tài khoản admin</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Mã nhân viên</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-id-badge"></i>
                    </span>
                    <input
                      v-model="form.username"
                      type="text"
                      class="form-control"
                      placeholder="Nhập mã nhân viên (VD: NV001)"
                      required
                      :disabled="loading"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      placeholder="Nhập mật khẩu"
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

                <div v-if="error" class="alert alert-danger">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
                </button>

                <div class="text-center">
                  <router-link to="/registerStaff" class="text-decoration-none">
                    <i></i>Đăng ký Staff ngay
                  </router-link>
                </div>

                <div class="text-center">
                  <router-link to="/" class="text-decoration-none">
                    <i class="fas fa-arrow-left me-2"></i>Về trang Đăng nhập Độc
                    Giả
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
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { loginStaff } = useAuth();

const form = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const result = await loginStaff({
      username: form.value.username,
      password: form.value.password,
    });

    if (result.success) {
      router.push("/admin");
    } else {
      error.value = result.error || "Đăng nhập thất bại";
    }
  } catch {
    error.value = "Có lỗi xảy ra";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
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

.btn-success {
  background: linear-gradient(45deg, #198754, #0f5132);
  border: none;
  border-radius: 0.5rem;
}
</style>
