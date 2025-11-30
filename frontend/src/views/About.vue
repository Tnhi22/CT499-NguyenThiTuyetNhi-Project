<template>
  <div class="public-about">
    <!-- Hero Banner -->
    <section class="about-hero">
      <img
        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
        alt="About Hero"
        class="about-hero-img"
      />
      <div class="about-hero-overlay"></div>
      <div class="about-hero-content">
        <h1>Chào mừng đến với Thư Viện Online</h1>
        <p>
          Mang cả thế giới tri thức đến tay bạn, từng trang sách, từng ý tưởng.
        </p>
        <router-link to="/books" class="btn btn-primary btn-hero">
          Khám phá ngay
        </router-link>
      </div>
    </section>

    <!-- About Info -->
    <section class="about-info py-5">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
              alt="Library"
              class="img-fluid rounded shadow-lg about-info-img"
            />
          </div>
          <div class="col-md-6">
            <h2>Về chúng tôi</h2>
            <p>
              Thư Viện Online là nền tảng sách trực tuyến, nơi bạn có thể khám
              phá, học hỏi và kết nối với tri thức toàn cầu. Chúng tôi tin rằng
              mỗi cuốn sách là một hành trình, và mỗi độc giả là một nhà thám
              hiểm.
            </p>
            <p>
              Với giao diện thân thiện, trải nghiệm mượt mà, và kho sách đa
              dạng, chúng tôi mang đến cho bạn không gian học tập và giải trí
              tuyệt vời.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values / Highlights -->
    <section class="about-values py-5 bg-gradient">
      <div class="container text-center">
        <h2 class="mb-4 text-white">Giá trị cốt lõi của chúng tôi</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="value-card">
              <i class="fas fa-book-open fa-3x text-primary mb-3"></i>
              <h5>Tri thức vô tận</h5>
              <p>Mỗi cuốn sách là một hành trình mở ra thế giới mới.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="value-card">
              <i class="fas fa-users fa-3x text-primary mb-3"></i>
              <h5>Kết nối cộng đồng</h5>
              <p>Kết nối độc giả và tác giả trên toàn cầu.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="value-card">
              <i class="fas fa-star fa-3x text-primary mb-3"></i>
              <h5>Trải nghiệm tuyệt vời</h5>
              <p>Giao diện sang trọng, dễ sử dụng, mọi nơi, mọi lúc.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team / Publisher -->
    <section class="about-team py-5">
      <div class="container text-center">
        <h2 class="mb-4">Đội ngũ sáng lập</h2>
        <div class="row g-4 justify-content-center">
          <div class="col-6 col-md-3" v-for="member in team" :key="member.id">
            <div class="team-card">
              <img :src="member.photo" alt="" class="team-img" />
              <h6 class="team-name mt-2">{{ member.name }}</h6>
              <small class="team-role text-muted">{{ member.role }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="about-cta py-5 text-center bg-primary text-white">
      <h3 class="mb-3">Bắt đầu hành trình tri thức của bạn ngay hôm nay!</h3>
      <router-link to="/books" class="btn btn-light btn-lg"
        >Khám phá sách</router-link
      >
    </section>
  </div>
</template>

<style>
/* ================== About Page ================== */
.about-hero {
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 1.5rem;
  margin-bottom: 3rem;
}
.about-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 1.2s ease-out;
}
.about-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
.about-hero-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 4rem;
  color: #fff;
}
.about-hero-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.about-hero-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}
.btn-hero {
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  background: linear-gradient(145deg, #0d6efd, #5a9bff);
  color: #fff;
  border: none;
  transition: all 0.35s ease;
}
.btn-hero:hover {
  background: linear-gradient(145deg, #ff7f50, #ffb370);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

/* About Info Section */
.about-info h2 {
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 1.5rem;
}
.about-info p {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
}
.about-info-img {
  border-radius: 1.5rem;
}

/* Values / Highlights */
.about-values {
  background: linear-gradient(135deg, #0d6efd, #5a9bff);
}
.value-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  padding: 2rem 1rem;
  transition: transform 0.35s, box-shadow 0.35s;
}
.value-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
}
.value-card h5 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.value-card p {
  font-size: 0.9rem;
}

/* Team Section */
.team-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 1.5rem;
  overflow: hidden;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.35s, box-shadow 0.35s;
}
.team-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
}
.team-img {
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
  height: 180px;
}
.team-name {
  font-weight: 600;
  margin-top: 0.5rem;
}
.team-role {
  font-size: 0.85rem;
}

/* CTA */
.about-cta {
  border-radius: 1.25rem;
}
.about-cta .btn {
  font-weight: 600;
  padding: 0.65rem 1.75rem;
  border-radius: 50px;
  transition: all 0.35s ease;
}
.about-cta .btn:hover {
  background: linear-gradient(145deg, #0d6efd, #5a9bff);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

/* Responsive */
@media (max-width: 992px) {
  .about-hero {
    height: 280px;
  }
  .about-hero-content {
    padding: 0 2rem;
  }
  .about-hero-content h1 {
    font-size: 1.8rem;
  }
  .about-hero-content p {
    font-size: 1rem;
  }
}
@media (max-width: 768px) {
  .about-hero {
    height: 220px;
  }
  .about-hero-content {
    align-items: center;
    text-align: center;
    padding: 0 1rem;
  }
  .about-hero-content h1 {
    font-size: 1.5rem;
  }
  .about-hero-content p {
    font-size: 0.95rem;
  }
}
</style>
