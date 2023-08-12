let header = document.querySelector('.header')
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll >= 100) {
    header.style.opacity = 1;
  } else {
    header.style.opacity = 0;
  }
})

// from unixporn-github
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


const themeIcon = document.getElementById("themeIcon");
const themetxt = document.querySelector(".theme-name")
const btn = document.getElementById("js-themeSwitcher")

function setDark() {
  themeIcon.classList.remove("bi-sun-fill");
  themeIcon.classList.add("bi-moon-stars-fill");

  btn.classList.add('darky')
  btn.classList.remove('lighty')

  themetxt.innerHTML = "Dark"
  document.documentElement.style.setProperty("--body-background", "#1a1b23");
  document.documentElement.style.setProperty("--font-color", "#fff");
  document.documentElement.style.setProperty("--body-background-lighter", "#2d2f39");
  document.documentElement.style.setProperty("--body-background-darker", "#14151a");

  setCookie('theme', 'dark', 365);
  document.documentElement.setAttribute('data-theme', 'dark');

}

function setLight() {

  themeIcon.classList.remove("bi-moon-stars-fill");
  themeIcon.classList.add("bi-sun-fill");

  btn.classList.remove('darky')
  btn.classList.add('lighty')

  themetxt.innerHTML = "Light"
  document.documentElement.style.setProperty("--body-background", "#e4e7f6");
  document.documentElement.style.setProperty("--font-color", "#16171E");
  document.documentElement.style.setProperty("--body-background-lighter", "#fff");
  document.documentElement.style.setProperty("--body-background-darker", "#DADADC");

  setCookie('theme', 'light', 365);
  document.documentElement.setAttribute('data-theme', 'light');
}

function setSavedTheme() {
  let theme = getCookie('theme');
  switch (theme) {
    case 'dark':
      setDark();
      break;
    case 'light':
      setLight();
      break;
  }
}

function toggleTheme() {
  if (themeIcon.classList.contains("bi-moon-stars-fill")) {
    setLight();
  } else {
    setDark();
  }
}

document.getElementById("js-themeSwitcher").addEventListener('click', () => toggleTheme());

window.addEventListener("load", () => setSavedTheme());