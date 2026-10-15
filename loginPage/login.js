$(document).ready(function () {
  var API = "https://dummyjson.com";
  var langkah = 1;
  var user = null;

  function tampilPesan(teks, tipe) {
    $("#pesan").removeClass("error sukses").addClass(tipe).text(teks).show();
  }

  function sembunyiPesan() {
    $("#pesan").hide();
  }

  function cekAkun() {
    var input = $("#akun").val().trim().toLowerCase();

    if (input == "") {
      $("#akun").addClass("invalid");
      tampilPesan("Nomor ponsel atau email wajib diisi", "error");
      return;
    }
    $("#btnNext").prop("disabled", true).text("Memeriksa...");
    
    fetch(API + "/users?limit=0&select=username,email,phone,firstName,lastName,image")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("gagal");
        }
        return response.json();
      })
      .then(function (res) {
        user = null;
        for (var i = 0; i < res.users.length; i++) {
          var u = res.users[i];
          var nomor = u.phone.replace(/\D/g, "");
          if (u.email.toLowerCase() == input || u.username.toLowerCase() == input || nomor == input) {
            user = u;
            break;
          }
        }
        if (user == null) {
          $("#akun").addClass("invalid");
          tampilPesan("Akun tidak terdaftar", "error");
          $("#btnNext").prop("disabled", false).text("Selanjutnya");
          return;
        }

        $("#avatar").attr("src", user.image);
        $("#namaUser").text(user.firstName + " " + user.lastName);
        $("#stepAkun").hide();
        $("#stepPassword").show();
        $("#password").focus();
        $("#btnNext").prop("disabled", false).text("Masuk");
        langkah = 2;
      })
      .catch(function () {
        tampilPesan("Gagal terhubung ke server", "error");
        $("#btnNext").prop("disabled", false).text("Selanjutnya");
      });
  }

  function login() {
    var pass = $("#password").val();
    if (pass == "") {
      $("#password").addClass("invalid");
      tampilPesan("Kata sandi wajib diisi", "error");
      return;
    }
    $("#btnNext").prop("disabled", true).text("Masuk...");

    fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        password: pass
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("ditolak");
        }
        return response.json();
      })
      .then(function (res) {
        sessionStorage.setItem("token", res.accessToken || res.token);
        sessionStorage.setItem("nama", res.firstName + " " + res.lastName);
        tampilPesan("Berhasil masuk! Selamat datang, " + res.firstName, "sukses");
        $("#btnNext").text("Berhasil");

        setTimeout(function () {
          window.location.href = "../homePage/index.html";
        }, 1500);
      })
      .catch(function (err) {
        $("#btnNext").prop("disabled", false).text("Masuk");
        if (err.message == "ditolak") {
          $("#password").addClass("invalid");
          tampilPesan("Kata sandi salah", "error");
        } else {
          tampilPesan("Gagal terhubung ke server", "error");
        }
      });
  }

  $("#formLogin").on("submit", function (e) {
    e.preventDefault();

    if (langkah == 1) {
      cekAkun();
    } else {
      login();
    }
  });

  $("#akun, #password").on("input", function () {
    $(this).removeClass("invalid");
    sembunyiPesan();
  });

  $("#togglePass").on("click", function () {
    if ($("#password").attr("type") == "password") {
      $("#password").attr("type", "text");
      $(this).text("Sembunyikan");
    } else {
      $("#password").attr("type", "password");
      $(this).text("Tampilkan");
    }
  });

  $("#ganti").on("click", function (e) {
    e.preventDefault();
    langkah = 1;
    $("#password").val("");
    $("#btnNext").text("Selanjutnya");
    sembunyiPesan();
    $("#stepPassword").hide();
    $("#stepAkun").show();
    $("#akun").focus();
  });

  $(".btn-google").on("click", function () {
    tampilPesan("Login Google belum tersedia", "error");
  });
});