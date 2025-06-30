export function logout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("userAvatar");
  localStorage.removeItem("userScore");

  // Tidak menghapus scoreHistory & users
  window.location.href = "index.html";
}
