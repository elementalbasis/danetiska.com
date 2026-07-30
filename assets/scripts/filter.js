const menu = document.querySelector(".tag-menu");

if (menu) {
  const buttons = menu.querySelectorAll("button[data-tag]");
  const items = document.querySelectorAll("[data-tags]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedTag = button.dataset.tag;

      buttons.forEach(function (otherButton) {
        otherButton.classList.remove("active");
      });

      button.classList.add("active");

      items.forEach(function (item) {
        let tags = [];

        try {
          tags = JSON.parse(item.dataset.tags);
        } catch (error) {
          console.error("Invalid data-tags value:", item.dataset.tags);
        }

        const matches =
          selectedTag === "all" ||
          tags.includes(selectedTag);

        item.style.display = matches ? "" : "none";
      });
    });
  });
}
