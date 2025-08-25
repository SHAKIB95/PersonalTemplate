import Alpine from "alpinejs";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../input.css";
import emailjs from "@emailjs/browser";

window.Alpine = Alpine;

function contactForm() {
  return {
    formData: {
      email: "",
      user_phone: "",
      message: "",
      name: "",
    },
    errors: {},
    loading: false,
    successMessage: "",

    validateForm() {
      this.errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^09[0-9]{9}$/;
      if (!this.formData.name) {
        this.errors.name = "نام خود را وارد کنید";
      }
      if (!this.formData.email) {
        this.errors.email = "ایمیل الزامی است.";
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = "فرمت ایمیل صحیح نیست.";
      }
      if (!this.formData.user_phone) {
        this.errors.user_phone = "شماره موبایل الزامی است";
      } else if (!phoneRegex.test(this.formData.user_phone)) {
        this.errors.user_phone = "شماره موبایل صحیح نمی باشد";
      }
      if (!this.formData.message) {
        this.errors.message = "نوشتن پیام الزامی است.";
      }
      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        this.loading = true;
        this.successMessage = "";

        const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        emailjs
          .send(serviceID, templateID, this.formData, {
            publicKey: publicKey,
          })
          .then((response) => {
            this.successMessage = "ایمیل با موفقیت ارسال شد! متشکریم.";
            console.log("SUCCESS!", response.status, response.text);
            this.formData.name = "";
            this.formData.email = "";
            this.formData.user_phone = "";
            this.formData.message = "";
          })
          .catch((err) => {
            this.errors.general = "خطایی در ارسال ایمیل رخ داد. لطفاً دوباره تلاش کنید.";
            console.log("FAILED...", err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  };
}

window.contactForm = contactForm;

Alpine.start();

const swiper = new Swiper(".mySwiper", {
  modules: [Navigation, Pagination, Autoplay],
  slidesPerView: 2,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".custom-next",
    prevEl: ".custom-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 2,
    },
  },
});
