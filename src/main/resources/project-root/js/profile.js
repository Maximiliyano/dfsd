document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const sidebar = document.querySelector(".sidebar");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileModal = document.getElementById("editProfileModal");
  const closeEditProfileModalBtn = document.getElementById("closeEditProfileModal");
  const profileForm = document.getElementById("profileForm");
  const profileNameInput = document.getElementById("profileName");
  const profileBirthdayInput = document.getElementById("profileBirthday");
  const profileClassInput = document.getElementById("profileClass");
  const profileParentsInput = document.getElementById("profileParents");
  const profileInfoTextarea = document.getElementById("profileInfo");
  const profileAvatarImg = document.querySelector(".profile-avatar");
  const currentPhotoImg = document.querySelector(".current-photo");
  const profilePhotoInput = document.getElementById("profilePhoto");
  const userSearchInput = document.getElementById("userSearchInput");
  const searchUsersBtn = document.getElementById("searchUsersBtn");
  const userSearchResults = document.getElementById("userSearchResults");
  const profileViewModal = document.getElementById("profileModal");
  const closeProfileViewModalBtn = document.getElementById("closeProfileViewModal");
  const modalProfileName = document.getElementById("modalProfileName");
  const modalProfileAvatar = document.getElementById("modalProfileAvatar");
  const modalProfileFullName = document.getElementById("modalProfileFullName");
  const modalProfileEmail = document.getElementById("modalProfileEmail");
  const modalProfileRole = document.getElementById("modalProfileRole");
  const modalProfileBirthday = document.getElementById("modalProfileBirthday");
  const modalProfileClass = document.getElementById("modalProfileClass");
  const modalProfileParents = document.getElementById("modalProfileParents");
  const modalProfileInfo = document.getElementById("modalProfileInfo");

  let ownProfile = {
    name: "Євген Цискар",
    email: "yevhen.tsyskar@example.com",
    role: "Учень",
    birthday: "2005-08-15",
    class: "10-А",
    parents: "Іван та Марія Цискар",
    info: "Захоплююсь програмуванням та робототехнікою.",
    photo: "../assets/images/user-avatar.png"
  };

  let otherUsers = [
    {
      id: 201,
      name: "Олена Петренко",
      email: "olena.petrenko@example.com",
      role: "Викладач",
      subject: "Математика",
      classTeacherOf: "11-Б",
      info: "Викладаю математику та є класним керівником 11-Б класу.",
      photo: "../assets/images/teacher-avatar.png"
    },
    {
      id: 202,
      name: "Андрій Сидоров",
      email: "andriy.sydorov@example.com",
      role: "Батько",
      parentOf: "Софія Сидорова",
      info: "Батько Софії Сидорової, учениці 5-Б класу.",
      photo: "../assets/images/parent-avatar.png"
    },
    {
      id: 203,
      name: "Софія Сидорова",
      email: "sofiya.sydorova@example.com",
      role: "Учень",
      birthday: "2010-11-05",
      class: "5-Б",
      parents: "Андрій та Наталія Сидорові",
      info: "Люблю малювати та читати.",
      photo: "../assets/images/student-avatar.png"
    }
  ];

  navToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  function displayOwnProfileInfo() {
    const profileNameHeader = document.querySelector(".profile-name");
    const profileEmailHeader = document.querySelector(".profile-email");
    const profileRoleHeader = document.querySelector(".profile-role");
    const birthdayValue = document.querySelector(".detail-value:nth-child(2)");
    const classValue = document.querySelector(".detail-value:nth-child(4)");
    const parentsValue = document.querySelector(".detail-value:nth-child(6)");
    const infoValue = document.querySelector(".detail-value:nth-child(8)");
    const avatarImage = document.querySelector(".profile-avatar");

    if (profileNameHeader) profileNameHeader.textContent = ownProfile.name;
    if (profileEmailHeader) profileEmailHeader.textContent = ownProfile.email;
    if (profileRoleHeader) profileRoleHeader.textContent = ownProfile.role;
    if (birthdayValue) birthdayValue.textContent = formatDate(ownProfile.birthday);
    if (classValue) classValue.textContent = ownProfile.class;
    if (parentsValue) parentsValue.textContent = ownProfile.parents;
    if (infoValue) infoValue.textContent = ownProfile.info;
    if (avatarImage) avatarImage.src = ownProfile.photo;
  }

  function formatDate(dateStr) {
    const dateParts = dateStr.split('-');
    if (dateParts.length === 3) {
      return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    }
    return dateStr;
  }

  if (editProfileBtn && editProfileModal) {
    editProfileBtn.addEventListener("click", () => {
      profileNameInput.value = ownProfile.name;
      profileBirthdayInput.value = ownProfile.birthday;
      profileClassInput.value = ownProfile.class;
      profileParentsInput.value = ownProfile.parents;
      profileInfoTextarea.value = ownProfile.info;
      currentPhotoImg.src = ownProfile.photo;
      editProfileModal.style.display = "flex";
    });
  }

  if (closeEditProfileModalBtn && editProfileModal) {
    closeEditProfileModalBtn.addEventListener("click", () => {
      editProfileModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === editProfileModal) {
      editProfileModal.style.display = "none";
    }
    if (e.target === profileViewModal) {
      profileViewModal.style.display = "none";
    }
  });

  if (profilePhotoInput && currentPhotoImg && profileAvatarImg) {
    profilePhotoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          currentPhotoImg.src = e.target.result;
          ownProfile.photo = e.target.result;
          profileAvatarImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (profileForm && editProfileModal) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      ownProfile.name = profileNameInput.value.trim();
      ownProfile.birthday = profileBirthdayInput.value;
      ownProfile.class = profileClassInput.value.trim();
      ownProfile.parents = profileParentsInput.value.trim();
      ownProfile.info = profileInfoTextarea.value.trim();

      editProfileModal.style.display = "none";
      displayOwnProfileInfo();

      console.log("Оновлені дані профілю:", ownProfile);
      alert("Профіль оновлено!");
    });
  }

  function displayOtherUserProfile(user) {
    modalProfileName.textContent = `Профіль користувача: ${user.name}`;
    modalProfileFullName.textContent = user.name;
    modalProfileEmail.textContent = user.email;
    modalProfileRole.textContent = user.role;
    modalProfileBirthday.parentElement.style.display = user.birthday ? "block" : "none";
    modalProfileBirthday.textContent = formatDate(user.birthday || "");

    modalProfileClass.parentElement.style.display = (user.class || user.subject || user.classTeacherOf) ? "block" : "none";
    modalProfileClass.textContent = user.class || user.subject || (user.classTeacherOf ? `Класний керівник ${user.classTeacherOf}` : "Інформація відсутня");

    modalProfileParents.parentElement.style.display = user.parents ? "block" : "none";
    modalProfileParents.textContent = user.parents || "";

    const parentOfLabel = document.querySelector("#modalProfileParents").previousElementSibling;
    if (user.parentOf) {
      parentOfLabel.textContent = "Батько/мати:";
      modalProfileParents.textContent = user.parentOf;
      modalProfileBirthday.parentElement.style.display = "none";
    } else {
      parentOfLabel.textContent = "Батьки:";
    }

    modalProfileInfo.textContent = user.info || "Додаткова інформація відсутня";
    modalProfileAvatar.src = user.photo || "../assets/images/user-avatar.png";
    profileViewModal.style.display = "flex";
  }

  if (closeProfileViewModalBtn && profileViewModal) {
    closeProfileViewModalBtn.addEventListener("click", () => {
      profileViewModal.style.display = "none";
    });
  }

  if (searchUsersBtn && userSearchInput && userSearchResults) {
    searchUsersBtn.addEventListener("click", () => {
      const searchTerm = userSearchInput.value.trim().toLowerCase();
      const results = otherUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
      );
      displaySearchResults(results);
    });

    userSearchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        searchUsersBtn.click();
      }
    });
  }

  function displaySearchResults(results) {
    userSearchResults.innerHTML = "";
    if (results.length > 0) {
      results.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");
        userItem.innerHTML = `
          <img src="${user.photo || '../assets/images/user-avatar-small.png'}" alt="Аватар" class="user-avatar-small">
          <span>${user.name}</span> (${user.email}) - ${user.role}
        `;
        userItem.addEventListener("click", () => {
          displayOtherUserProfile(user);
        });
        userSearchResults.appendChild(userItem);
      });
    } else {
      userSearchResults.textContent = "Користувачів не знайдено.";
    }
  }

  displayOwnProfileInfo();
});