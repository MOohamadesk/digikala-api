let API_BASE =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "";
(function () {
  "use strict";

  function bgChange() {
    let bgChanger = document.getElementById(`menuSpecial`);
    let subWrapped = document.getElementById(`subWrapper`);

    if (bgChanger && subWrapped) {
      bgChanger.addEventListener("mouseover", () => {
        subWrapped.classList.add(
          "overflow-hidden",
          "bg-black/40",
          "bg-opacity-50"
        );
      });

      bgChanger.addEventListener("mouseleave", () => {
        subWrapped.classList.remove(
          "overflow-hidden",
          "bg-black/40",
          "bg-opacity-50"
        );
      });
    }
  }

  function generateRegularMenu(items) {
    return items
      .map(
        (item) => `
      <li class="header--nav-item py-3 px-4 transition-all duration-100 font-IRyekan text-lg font-extralight tracking-widest leading-5
        flex flex-row flex-nowrap items-center gap-1">
        <a class="header--nav-link relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-crimson after:rounded-[1px] after:transition-all after:duration-300 hover:after:w-full no-underline text-xs flex items-center justify-center transition-all duration-80"
           href="${item.link}">
          ${item.icon ? `<img src="${item.icon}" alt="آیکون" />` : ""} 
          ${item.title}
        </a>
      </li>
    `
      )
      .join("");
  }

  function generateSideMenu(items) {
    return items
      .map(
        (item) => `
      <li class="header--nav-item py-3 px-2 transition-all duration-100 font-IRyekan text-lg font-extralight tracking-widest leading-5
        flex flex-row flex-nowrap items-center justify-between">
        <a class="header--nav-link relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-crimson after:rounded-[1px] after:transition-all after:duration-300 hover:after:w-full no-underline text-xs flex items-center justify-center transition-all duration-80 pl-4 px-4"
           href="${item.link}">
          ${item.title}
        </a>
      </li>
    `
      )
      .join("");
  }

  function createCategoryMenu(categoryItem) {
    if (!categoryItem) return "";

    const categoryHTML = `
      <li class="header--nav-item py-3 px-4 transition-all duration-100 font-IRyekan text-lg font-extralight tracking-widest leading-5
        flex flex-row flex-nowrap items-center gap-1 group "
        id="menuSpecial">
        <a
          class="header--nav-link relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-crimson after:rounded-[1px] after:transition-all after:duration-300 hover:after:w-full no-underline text-xs flex items-center justify-center transition-all duration-100 category"
          href="${categoryItem.link}">
          <img src="${categoryItem.icon}" alt="آیکون" />
          ${categoryItem.title}
          <span class="nav--line"></span>
        </a>
        ${createSubMenu(categoryItem.subMenu)}
      </li><span class="text-gray-400/40 text-sm font-light leading-4 cursor-none">|</span>
      `;

    return categoryHTML;
  }

  function createSubMenu(subMenuItems) {
    if (!subMenuItems || !Array.isArray(subMenuItems)) return "";

    return `
      <div class="w-50 bg-gray-100 h-menuH absolute right-5 top-10 z-50  overflow-y-auto py-0 overflow-hidden scroll-auto menuScroll hidden group-hover:block duration-300">
        <div class="dirRTL w-full h-full">
          ${subMenuItems
            .map(
              (item) => `
            <div class="w-full h-13 my-1 flex flex-col cursor-pointer group/sub">
              <a href="${
                item.link
              }" class="flex flex-row items-center justify-start px-2 py-5 w-full h-12 p-4 bg-[#F5F5F5] hover:bg-white hover:text-green-200 gap-1.5">
                ${item.icon ? `<img src="${item.icon}" alt="آیکون" />` : ""}
                <span class="font-semibold text-xs leading-0.5 text-[#ef394e]">${
                  item.title
                }</span>
              </a>
              ${item.subsub ? createSubSubMenu(item.subsub) : ""}
            </div>
          `
            )
            .join("")}
        </div>
      </div>`;
  }

  function createSubSubMenu(subSubData) {
    if (!subSubData || Object.keys(subSubData).length === 0) return "";

    return `
      <div class="sub-sub-menu absolute right-0 top-0 bg-red-600! shadow-lg hidden group-hover/sub:block">
        ${Object.values(subSubData)
          .map(
            (subItem) => `
          <a href="${subItem.link}" class="block px-4 py-2 hover:bg-gray-100">${subItem.title}</a>
        `
          )
          .join("")}
      </div>`;
  }

  async function MenuFetch() {
    try {
      const response = await fetch(`${API_BASE}data/data-01.json`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const sideMenuItems = data?.sideMenu || [];
      const sumMenuItems = data?.sumMenu || [];

      const categoryItem = sumMenuItems.find(
        (item) => item.title === "دسته بندی کالاها" || item.id === "0"
      );

      const regularSumMenuItems = sumMenuItems.filter(
        (item) => item !== categoryItem
      );

      const categoryHTML = createCategoryMenu(categoryItem);
      const regularMenuHTML = generateRegularMenu(regularSumMenuItems);
      const sideMenuHTML = generateSideMenu(sideMenuItems);

      document.querySelector(".nav--ulist").innerHTML =
        categoryHTML + regularMenuHTML;
      document.querySelector(".sideMenu").innerHTML = sideMenuHTML;

      if (categoryItem) {
        bgChange();
      }
    } catch (error) {
      console.error("Failed to load menu:", error.message);
      // Fallback to static data or show error
    }
  }

  function addFirstElementStyle() {
    const firstElement = document.getElementById("menuSpecial");
    if (firstElement) {
      firstElement.classList.add("text-lg");
    }
  }

  async function fetchStories() {
    try {
      const response = await fetch(`${API_BASE}data/data-02.json`);
      const data = await response.json();

      const viewedStories = JSON.parse(
        localStorage.getItem("viewedStories") || "[]"
      );

      const updatedStories = data.stories.map((story) => ({
        ...story,
        viewed: viewedStories.includes(story.id),
      }));

      displayStories(updatedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }
  function displayStories(stories) {
    const container = document.getElementById("storiesContainer");
    if (!container) return;

    container.innerHTML = "";

    stories.forEach((story) => {
      const storyElement = document.createElement("div");
      storyElement.className = "swiper-slide";

      const borderClass = story.viewed ? "viewed-border" : "unviewed-border";
      const gradientClass = story.viewed ? "" : "gradient-border";

      storyElement.innerHTML = `
        <div class="story-item">
          <div class="story-image-container ${gradientClass}">
            <img 
              src="${story.image}" 
              alt="${story.title}"
              class="${borderClass}"
              onclick="window.viewStory(${story.id})"
              data-story-id="${story.id}"
            >
          </div>
          <div class="story-title">
            ${story.title}
          </div>
        </div>
      `;

      container.appendChild(storyElement);
    });

    setTimeout(() => {
      initStorySwiper();
    }, 100);
  }

  async function viewStory(storyId) {
    const viewedStories = JSON.parse(
      localStorage.getItem("viewedStories") || "[]"
    );
    if (!viewedStories.includes(storyId)) {
      viewedStories.push(storyId);
      localStorage.setItem("viewedStories", JSON.stringify(viewedStories));
    }

    const storyImage = document.querySelector(`[data-story-id="${storyId}"]`);
    if (storyImage) {
      storyImage.classList.remove("unviewed-border");
      storyImage.classList.add("viewed-border");

      const parentDiv = storyImage.parentElement;
      if (parentDiv.classList.contains("gradient-border")) {
        parentDiv.classList.remove("gradient-border");
      }
    }
  }

  function initStorySwiper() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper is not loaded.");
      return;
    }

    if (window.storySwiper) {
      window.storySwiper.destroy(true, true);
    }

    window.storySwiper = new Swiper(".storySwiper", {
      slidesPerView: "auto",
      spaceBetween: 8,
      freeMode: true,
      grabCursor: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 0.5,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        320: {
          slidesPerView: 4.5,
          spaceBetween: 8,
        },
        480: {
          slidesPerView: 6.5,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 8.5,
          spaceBetween: 8,
        },
        768: {
          slidesPerView: 10.5,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 12.5,
          spaceBetween: 8,
        },
        1280: {
          slidesPerView: 12.5,
          spaceBetween: 8,
        },
      },
    });
  }

  async function fetchFullSlider() {
    try {
      let response = await fetch(`${API_BASE}data/data-03.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      displayFullSlider(data.data);
    } catch (error) {
      console.error("Error fetching slider:", error);
    }
  }

  function displayFullSlider(fullSlide) {
    const fullSwiperElement = document.getElementById("fullSwiper");
    if (!fullSwiperElement) return;

    const slidesHTML = fullSlide
      .map(
        (slide, index) => `
      <div class="swiper-slide ${index === 0 ? "swiper-slide-active" : ""}">
        <img 
          src="${slide.image}" 
          alt="${slide.title || ""}" 
          class="w-full h-full object-cover"
        >
      </div>
    `
      )
      .join("");

    fullSwiperElement.innerHTML = slidesHTML;

    setTimeout(initializeFullSwiper, 100);
  }

  function initializeFullSwiper() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper library not loaded!");
      setTimeout(initializeFullSwiper, 2000);
      return;
    }

    const fullSwiper = new Swiper(".myFullSwiper", {
      slidesPerView: 1,
      spaceBetween: 1,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
      },
    });
  }

  let modalData = null;

  async function fetchSumLinks() {
    try {
      const response = await fetch(`${API_BASE}data/data-04.json`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      modalData = data.modal;
      const firstNineItems = data.data.slice(0, 9);
      const deepLinks = firstNineItems
        .map((item) => {
          let fullUrl = item.url.uri || "#";
          if (item.url.base) {
            fullUrl = item.url.base + (item.url.uri || "");
          }
          return `
            <div class="dl-element w-16 h-full flex flex-col items-center justify-around">
              <a class="no-underline hover:cursor-pointer w-12 h-12 bg-[#F0F0F1] rounded-full flex items-center justify-center"
                href="${fullUrl}">
                <img src="${item.icon.url[0]}" alt="${item.title}" />
              </a>
              <p class="text-xs px-4 text-center hover:cursor-pointer">
                ${item.title}
              </p>
            </div>`;
        })
        .join("");
      const moreButtonHtml = `
        <div class="dl-element w-16 h-full flex flex-col items-center justify-around">
          <button class="no-underline hover:cursor-pointer w-12 h-12 bg-[#F0F0F1] rounded-full flex items-center justify-center more-modal-button">
            <img src="/images/deep-links/showmore.svg" alt="بیشتر" />
          </button>
          <p class="text-xs px-4 text-center hover:cursor-pointer">بیشتر</p>
        </div>`;

      const sumLinks = document.getElementById("sumLinks");
      if (sumLinks) {
        sumLinks.innerHTML = deepLinks + moreButtonHtml;

        const button = sumLinks.querySelector(".more-modal-button");
        if (button) {
          button.addEventListener("click", openModal);
        }
      }
    } catch (error) {
      console.error("Error fetching sumLinks:", error);
    }
  }

  function openModal() {
    if (!modalData) {
      console.error("No modal data available");
      return;
    }
    const modal = document.getElementById("my_modal_8");
    if (!modal) return;

    populateModal();

    modal.classList.remove("hidden");
    modal.showModal();
  }

  function populateModal() {
    if (!modalData) return;
    const topIcons = modalData.slice(0, 6);
    const cardItems = modalData.slice(6);
    const topIconsHTML = topIcons
      .map((item) => {
        let fullUrl = item.url.uri || "#";
        if (item.url.base) {
          fullUrl = item.url.base + (item.url.uri || "");
        }
        return `
        <div class="dl-element w-16 h-full flex flex-col items-center justify-around">
          <a class="no-underline hover:cursor-pointer w-12 h-12 bg-[#F0F0F1] rounded-full flex items-center justify-center"
            href="${fullUrl}">
            <img src="${item.icon.url[0]}" alt="${item.title}" />
          </a>
          <p class="text-xs px-4 text-center hover:cursor-pointer">
            ${item.title}
          </p>
        </div>`;
      })
      .join("");

    const cardsHTML = cardItems
      .map((item) => {
        let fullUrl = item.url.uri || "#";
        if (item.url.base) {
          fullUrl = item.url.base + (item.url.uri || "");
        }

        return `
        <div class="card w-[45%] m-3 p-5 flex flex-row flex-nowrap items-center justify-center bg-base-100 card-xs shadow-sm">
          <div class="w-12 h-12 flex items-center justify-center mr-4">
            <img src="${item.icon.url[0]}" alt="${
          item.title
        }" class="w-10 h-10" />
          </div>
          <div class="card-body flex flex-col ">
            <h2 class="card-title text-sm">${item.title}</h2>
            <p class="text-xs text-gray-600">${item.description || ""}</p>
          </div>
          <div class="card-actions">
            <a href="${fullUrl}">
              <img src="/images/header/arrow-left/arrow-left.svg" alt="localicon" class="w-6 h-6 rotate-180" />
            </a>
          </div>
        </div>`;
      })
      .join("");

    const modalTopIcons = document.getElementById("modalTopIcons");
    const modalCards = document.getElementById("modalCards");

    if (modalTopIcons) modalTopIcons.innerHTML = topIconsHTML;
    if (modalCards) modalCards.innerHTML = cardsHTML;
  }

  let amazingSwiper = null;

  async function fetchAmazing() {
    try {
      let res = await fetch(`${API_BASE}data/data-05.json`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      let data = await res.json();
      displayAmazingProducts(data.products);
    } catch (error) {
      console.error("Error fetching amazing products:", error);
    }
  }

  function displayAmazingProducts(products) {
    const swiperWrapper = document.querySelector("#amazing .swiper-wrapper");
    if (!swiperWrapper) return;

    const firstSlide = swiperWrapper.children[0];
    const lastSlide = swiperWrapper.children[swiperWrapper.children.length - 1];

    swiperWrapper.innerHTML = "";
    swiperWrapper.appendChild(firstSlide);

    products.forEach((product, index) => {
      if (index < 12) {
        const slide = createProductSlide(product, index);
        swiperWrapper.appendChild(slide);
      }
    });

    swiperWrapper.appendChild(lastSlide);
    initAmazingSwiper();
  }

  function createProductSlide(product, index) {
    const slide = document.createElement("div");

    if (index === 0) {
      slide.className = "swiper-slide h-[90%]! m-auto bg-white rounded-r-2xl";
    } else {
      slide.className = "swiper-slide h-[90%]! m-auto bg-white";
    }

    const sellingPrice =
      product.price.selling_price || product.price.sell_price || 0;
    const rrpPrice = product.price.rrp_price || 0;

    let discountPercent = 0;
    if (rrpPrice > 0 && sellingPrice > 0 && rrpPrice > sellingPrice) {
      discountPercent = Math.round(
        ((rrpPrice - sellingPrice) / rrpPrice) * 100
      );
    }

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    slide.innerHTML = `
      <div class="h-full flex flex-col flex-nowrap items-center justify-around p-2">
        <div class="w-full h-40 object-cover flex items-center justify-center p-2">
          <img 
            src="${product.images.main.url[0]}" 
            alt="${product.title_fa}"
            class="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        
        <div class="flex flex-col items-center justify-center w-full ">
          <div class="w-full line-clamp-2 text-xs text-menuText font-normal text-start mb-2 h-10">
            <p class="leading-5">${product.title_fa}</p>
          </div>
          
          <div class="w-full flex flex-row items-center justify-between mb-1">
            ${
              discountPercent > 0
                ? `
              <div class="px-2 py-1 text-white text-xs rounded-full flex items-center justify-center bg-red-700">
                <span>${discountPercent}%</span>
              </div>
            `
                : ""
            }
            
            <div class="flex items-center justify-end gap-1 text-neutral-700">
              <span class="text-lg font-bold">${formatPrice(
                sellingPrice
              )}</span>
              <span class="text-xs"><img src="/images/amazing/toman.svg" alt="tomanicon"></span>
            </div>
          </div>
          
          ${
            rrpPrice > sellingPrice
              ? `
            <div class="content-end w-full text-left">
              <span class="text-xs text-[#c0c2c5] line-through leading-5">
                ${formatPrice(rrpPrice)} تومان
              </span>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    return slide;
  }

  function initAmazingSwiper() {
    if (amazingSwiper) {
      amazingSwiper.destroy(true, true);
    }

    amazingSwiper = new Swiper(".myAmazing", {
      slidesPerView: 8.2,
      spaceBetween: 2,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        320: { slidesPerView: 1.2, spaceBetween: 8 },
        480: { slidesPerView: 2.2, spaceBetween: 8 },
        640: { slidesPerView: 3.2, spaceBetween: 8 },
        768: { slidesPerView: 4.2, spaceBetween: 8 },
        1024: { slidesPerView: 6.2, spaceBetween: 8 },
        1280: { slidesPerView: 8.2, spaceBetween: 6 },
      },
    });
  }

  function initAmazingTimer() {
    const timerElement = document.querySelector(".clock-amazing");
    if (!timerElement) return;

    const hoursElement = timerElement.children[0];
    const minutesElement = timerElement.children[2];
    const secondsElement = timerElement.children[4];

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);

    function updateTimer() {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      hoursElement.textContent = hours.toString().padStart(2, "0");
      minutesElement.textContent = minutes.toString().padStart(2, "0");
      secondsElement.textContent = seconds.toString().padStart(2, "0");
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  async function fetchBanners() {
    try {
      const response = await fetch(`${API_BASE}data/data-06.json`);
      const data = await response.json();
      displaySingleBanners(data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }

  function displaySingleBanners(banners) {
    const container = document.querySelector(".bannersContainer");
    if (!container) {
      console.error("Container not found!");
      return;
    }

    container.innerHTML = "";

    banners.forEach((banner) => {
      const bannerDiv = document.createElement("div");
      bannerDiv.className = "w-1/4 p-2 rounded-2xl overflow-hidden";

      if (banner.url && banner.url.uri) {
        const link = document.createElement("a");
        link.href = banner.url.uri;
        link.className = "block w-full h-full";

        const img = document.createElement("img");
        img.className = "w-full h-full object-cover rounded-2xl";
        img.src = banner.image;
        img.alt = banner.title || "banner";

        link.appendChild(img);
        bannerDiv.appendChild(link);
      } else {
        const img = document.createElement("img");
        img.className = "w-full h-full object-cover rounded-2xl";
        img.src = banner.image;
        img.alt = banner.title || "banner";

        bannerDiv.appendChild(img);
      }

      container.appendChild(bannerDiv);
    });
  }

  let categoriesSwiper = null;

  async function fetchCategories() {
    try {
      const response = await fetch(`${API_BASE}data/data-07.json`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      displayCategories(data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function displayCategories(categories) {
    const container = document.querySelector("#digi-categories");
    if (!container) return;

    container.innerHTML = `
      <div class="swiper myCategories w-[90%]">
        <div class="swiper-wrapper"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;

    const swiperWrapper = container.querySelector(".swiper-wrapper");

    for (let i = 0; i < categories.length; i += 2) {
      const category1 = categories[i];
      const category2 = categories[i + 1];

      const slideHTML = createCategorySlide(category1, category2);
      const slideDiv = document.createElement("div");
      slideDiv.className = "swiper-slide";
      slideDiv.innerHTML = slideHTML;

      swiperWrapper.appendChild(slideDiv);
    }

    initCategoriesSwiper();
  }

  function createCategorySlide(category1, category2) {
    return `
      <div class="flex flex-col items-center justify-center gap-8">
        <div class="w-full flex flex-col flex-nowrap items-center justify-center mb-6">
          <div class="rounded-full overflow-hidden w-20 h-20 mb-2 border-2 border-transparent hover:border-red-500 transition-all duration-300">
            <a href="${category1?.url?.uri || "#"}" class="block w-full h-full">
              <img 
                src="${category1?.image || ""}" 
                alt="${category1?.title || ""}" 
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </a>
          </div>
          <div class="w-full mx-auto">
            <a href="${category1?.url?.uri || "#"}" class="no-underline group">
              <p class="text-sm font-semibold text-black text-center group-hover:text-red-600 transition-colors duration-200">
                ${category1?.title || ""}
              </p>
            </a>
          </div>
        </div>
        
        ${
          category2
            ? `
          <div class="w-full flex flex-col flex-nowrap gap-8! items-center justify-center">
            <div class="rounded-full overflow-hidden w-20 h-20 mb-2 border-2 border-transparent hover:border-red-500 transition-all duration-300">
              <a href="${category2.url.uri || "#"}" class="block w-full h-full">
                <img 
                  src="${category2.image}" 
                  alt="${category2.title}" 
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </a>
            </div>
            <div class="w-full mx-auto">
              <a href="${category2.url.uri || "#"}" class="no-underline group">
                <p class="text-sm font-semibold text-black text-center group-hover:text-red-600 transition-colors duration-200">
                  ${category2.title}
                </p>
              </a>
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  function initCategoriesSwiper() {
    if (categoriesSwiper) {
      categoriesSwiper.destroy(true, true);
    }

    categoriesSwiper = new Swiper(".myCategories", {
      slidesPerView: 7.5,
      spaceBetween: 5,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        320: {
          slidesPerView: 2.5,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 3.5,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 4.5,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 5.5,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 6.5,
          spaceBetween: 8,
        },
        1280: {
          slidesPerView: 7.5,
          spaceBetween: 5,
        },
      },
    });
  }

  async function fetchDoubleBanners() {
    try {
      const response = await fetch(`${API_BASE}data/data-08`);
      if (!response.ok) {
        throw new Error("خطا در شبکه");
      }
      return response.json();
    } catch (error) {
      console.error("خطا در دریافت داده‌ها:", error);
      return null;
    }
  }

  function displayDoubleBanners(data) {
    const container = document.querySelector(".doublebannersContainer");

    if (!container || !data.data) return;

    container.innerHTML = "";

    data.data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "w-1/2 p-2 rounded-2xl overflow-hidden";

      const link = document.createElement("a");
      link.href = item.url?.uri || "#";
      link.target = "_blank";
      link.className = "block w-full h-full";

      const img = document.createElement("img");
      img.className = "w-full h-full object-cover rounded-2xl";
      img.src = item.image;
      img.alt = item.title || "";
      img.loading = "lazy";

      link.appendChild(img);
      card.appendChild(link);
      container.appendChild(card);
    });
  }

  let brandsSwiper = null;

  async function fetchPopularBrands() {
    try {
      const response = await fetch(`${API_BASE}data/data-09`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      displayPopularBrands(data.data.brands);
    } catch (error) {
      console.error("Error fetching popular brands:", error);
    }
  }

  function displayPopularBrands(brands) {
    const container = document.querySelector(".popBrandsContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="swiper myBrands w-full">
        <div class="swiper-wrapper"></div>
        <div class="swiper-button-prev bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        </div>
        <div class="swiper-button-next bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        </div>
      </div>
    `;

    const swiperWrapper = container.querySelector(".swiper-wrapper");

    const validBrands = brands.filter(
      (brand) => brand.logo && brand.logo.url && brand.logo.url[0]
    );

    validBrands.forEach((brand) => {
      const slideHTML = createBrandSlide(brand);
      const slideDiv = document.createElement("div");
      slideDiv.className = "swiper-slide";
      slideDiv.innerHTML = slideHTML;
      swiperWrapper.appendChild(slideDiv);
    });

    initBrandsSwiper();
  }

  function createBrandSlide(brand) {
    const logoUrl = brand.logo.url[0];
    const brandUrl = brand.url?.uri || "#";
    const brandName = brand.title_fa || brand.title_en || "";

    return `
      <div class="w-full h-full flex items-center justify-center p-1">
        <a href="${brandUrl}" class="block w-full h-full">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-red-400 transition-all duration-300 group p-3">
            <img 
              src="${logoUrl}" 
              alt="${brandName}"
              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </a>
      </div>
    `;
  }

  function initBrandsSwiper() {
    if (brandsSwiper) {
      brandsSwiper.destroy(true, true);
    }

    brandsSwiper = new Swiper(".myBrands", {
      slidesPerView: 10,
      spaceBetween: 2,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        320: {
          slidesPerView: 5,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 10,
          spaceBetween: 2,
        },
      },
    });
  }

  async function loadDoubleSubBanners() {
    try {
      const response = await fetch(`${API_BASE}data/data-10`);

      if (!response.ok) {
        throw new Error(`خطا در دریافت داده: ${response.status}`);
      }

      const result = await response.json();
      let bannerData;

      if (result.data) {
        bannerData = result;
      } else if (result["data-10"]) {
        bannerData = result["data-10"];
      } else if (Array.isArray(result)) {
        bannerData = { data: result };
      } else {
        throw new Error("فرمت داده ناشناخته است");
      }

      displayDoubleSubBanners(bannerData);
    } catch (error) {
      console.error("خطا در دریافت داده:", error);
      displayError();
    }
  }

  function displayDoubleSubBanners(bannerData) {
    const container = document.querySelector(".doubleSubBannersContainer");

    if (!container) {
      console.error("کانتینر doubleSubBannersContainer پیدا نشد");
      return;
    }

    container.innerHTML = "";

    if (!bannerData) {
      container.innerHTML =
        '<p class="text-center text-gray-500 w-full">داده‌ای دریافت نشد</p>';
      return;
    }

    if (!bannerData.data || !Array.isArray(bannerData.data)) {
      console.error("داده‌ها به فرمت صحیح نیستند:", bannerData);
      container.innerHTML =
        '<p class="text-center text-red-500 w-full">فرمت داده نادرست است</p>';
      return;
    }

    if (bannerData.data.length === 0) {
      container.innerHTML =
        '<p class="text-center text-gray-500 w-full">هیچ بنری برای نمایش وجود ندارد</p>';
      return;
    }

    bannerData.data.forEach((item) => {
      if (!item || !item.image) {
        console.warn("آیتم نامعتبر در داده‌ها:", item);
        return;
      }

      const card = document.createElement("div");
      card.className =
        "w-1/2 p-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300";

      const link = document.createElement("a");
      link.href = item.url?.uri || "#";

      if (item.url?.uri && item.url.uri !== "#") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      link.className = "block w-full h-full";

      const img = document.createElement("img");
      img.className = "w-full h-full object-cover rounded-2xl";
      img.src = item.image;
      img.alt = item.title || "بنر تبلیغاتی";
      img.loading = "lazy";

      img.onerror = () => {
        console.warn(`تصویر بارگذاری نشد: ${item.image}`);
        img.src =
          "https://via.placeholder.com/400x200/F3F4F6/6B7280?text=تصویر+بارگذاری+نشد";
        img.style.backgroundColor = "#f3f4f6";
        img.style.minHeight = "150px";
      };

      link.appendChild(img);
      card.appendChild(link);
      container.appendChild(card);
    });
  }

  function displayError() {
    const container = document.querySelector(".doubleSubBannersContainer");

    if (!container) return;

    container.innerHTML = `
      <div class="w-full text-center py-8">
        <div class="inline-block p-4 bg-gray-100 rounded-lg">
          <p class="text-gray-600">خطا در بارگذاری بنرها</p>
          <button onclick="window.location.reload()" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            بارگذاری مجدد صفحه
          </button>
        </div>
      </div>
    `;
  }

  async function fetchCategoriesGrid() {
    try {
      const response = await fetch(`${API_BASE}data/data-11`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  function renderCategoriesGrid(categories) {
    const container = document.querySelector(".gridsContainer");
    if (!container) return;

    container.innerHTML = "";
    if (!categories) return;

    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className =
        "w-1/4 flex flex-col flex-nowrap items-center border border-gray-400/70 my-5 rounded-xl gap-2 p-2";
      const topSection = document.createElement("div");
      topSection.className =
        "w-full containTop flex flex-col items-start justify-center mb-2 border-b border-gray-400/70";
      const title = document.createElement("h3");
      title.className = "text-lg font-semibold text-[#23254e] mb-1";
      title.textContent = category.title;
      const subtitle = document.createElement("p");
      subtitle.className = "text-xs font-normal text-[#81858b]";
      subtitle.textContent = category.categorizedBy;
      topSection.appendChild(title);
      topSection.appendChild(subtitle);
      const bottomSection = document.createElement("div");
      bottomSection.className =
        "containBott grid grid-cols-2 grid-rows-2 gap-2";
      const imageKeys = ["image-1", "image-2", "image-3", "image-4"];
      imageKeys.forEach((key) => {
        if (category.images && category.images[key]) {
          const imageContainer = document.createElement("div");
          imageContainer.className = "col-span-1 row-span-1";
          const img = document.createElement("img");
          img.className = "w-full h-32 md:h-36 object-cover block rounded-lg";
          img.src = category.images[key];
          img.alt = category.title;

          imageContainer.appendChild(img);
          bottomSection.appendChild(imageContainer);
        }
      });
      categoryDiv.appendChild(topSection);
      categoryDiv.appendChild(bottomSection);
      container.appendChild(categoryDiv);
    });
  }

  async function fetchMagazinePosts() {
    try {
      const response = await fetch(`${API_BASE}data/data-12`);
      const data = await response.json();
      if (data.type === "magazine_posts" && data.data?.news) {
        const fourItems = data.data.news.slice(0, 4);
        renderMagazineRow(fourItems);
      }
    } catch (error) {
      console.error("Error fetching magazine data:", error);
    }
  }

  function renderMagazineRow(items) {
    const container = document.querySelector(".magContainer");
    if (!container) return;

    container.innerHTML = `
      ${items
        .map(
          (item) => `
        <div class="magItem w-[23%] bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div class="h-48 overflow-hidden">
            <img
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              src="${item.image}"
              alt="${item.title}"
            />
          </div>
          <div class="p-4">
            <p class="text-sm text-black/90 text-right line-clamp-2 min-h-[40px]">
              ${item.title}
            </p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-[#81858b]">${item.created_at}</span>
              <span class="text-xs text-[#81858b]">${item.category_title}</span>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    `;
  }

  // Initialize everything when DOM is loaded
  async function init() {
    try {
      await Promise.all([
        MenuFetch(),
        fetchStories(),
        fetchFullSlider(),
        fetchSumLinks(),
        fetchAmazing(),
        fetchBanners(),
        fetchCategories(),
        fetchPopularBrands(),
        loadDoubleSubBanners(),
      ]);

      // These can run in parallel after the main ones
      const doubleBannersData = await fetchDoubleBanners();
      if (doubleBannersData) {
        displayDoubleBanners(doubleBannersData);
      }

      const categoriesGridData = await fetchCategoriesGrid();
      if (categoriesGridData && categoriesGridData.data) {
        renderCategoriesGrid(categoriesGridData.data);
      }

      await fetchMagazinePosts();

      initAmazingTimer();
      addFirstElementStyle();
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }

  // Make functions available globally
  window.viewStory = viewStory;
  window.API_BASE = API_BASE;

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
