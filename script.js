// Tentukan waktu azan untuk setiap waktu sholat
const prayerTimes = {
    "Imsak": { hour: 3, minute: 30 },
    "Subuh": { hour: 3, minute: 40 },
    "Dhuhur": { hour: 11, minute: 22 },
    "Ashar": { hour: 14, minute: 46 },
    "Maghrib": { hour: 17, minute: 37 },
    "Isya": { hour: 18, minute: 52 }
};

// Fungsi untuk menghitung dan menampilkan waktu azan
function showPrayerTimeMessage(hours, minutes, seconds) {
    const currentTimeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    let nextPrayer = null;
    let currentPrayer = null;

    // Mencari waktu adzan saat ini dan selanjutnya
    for (const [prayer, time] of Object.entries(prayerTimes)) {
        const prayerTimeInSeconds = time.hour * 3600 + time.minute * 60;

        if (prayerTimeInSeconds === currentTimeInSeconds) {
            currentPrayer = prayer;
        } else if (prayerTimeInSeconds > currentTimeInSeconds && !nextPrayer) {
            nextPrayer = prayer;
        }
    }

    // Jika semua waktu sholat hari ini sudah berlalu, set nextPrayer ke Imsak
    if (!nextPrayer) {
        nextPrayer = "Imsak";
    }

    const nextPrayerTime = prayerTimes[nextPrayer];
    const nextPrayerInSeconds = nextPrayerTime.hour * 3600 + nextPrayerTime.minute * 60;
    let secondsUntilNextPrayer = nextPrayerInSeconds - currentTimeInSeconds;

    // Logika penyesuaian waktu untuk pergantian hari
    if (secondsUntilNextPrayer < 0) {
        secondsUntilNextPrayer += 24 * 3600;
    }

    const hoursUntilNextPrayer = Math.floor(secondsUntilNextPrayer / 3600);
    const minutesRemaining = Math.floor((secondsUntilNextPrayer % 3600) / 60);
    const secondsRemaining = secondsUntilNextPrayer % 60;
    const timeRemainingFormatted = `${String(hoursUntilNextPrayer).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;

    const runningText = document.getElementById('runningText');
    const nextPrayerText = document.getElementById('nextPrayerText');
    const audio = document.getElementById('azanAudio');

    if (currentPrayer) {
        if (currentPrayer === "Imsak") {
            if (runningText)
                runningText.textContent = "Sekarang Sudah Masuk Waktu Imsak, Segera Bersiap Untuk Puasa!";
            runningText.style.display = "block";
            nextPrayerText.style.display = "none";
        } else {
            if (runningText)
                runningText.textContent = `Sekarang Sudah Masuk Waktu Adzan Sholat ${currentPrayer}!`;
            runningText.style.display = "block";
            nextPrayerText.style.display = "none";

            // Tentukan file audio sesuai dengan waktu sholat
            audio.src = currentPrayer === "Subuh" ? "azan_subuh.mp3" : "adan.mp3";
            audio.currentTime = 0;  // Mulai dari awal

            // Putar audio
            audio.play();

            // Tampilkan pesan selama 60 detik
            setTimeout(() => {
                runningText.style.display = "none"; // Menyembunyikan setelah 60 detik
            }, 60000); // 60000 ms = 60 detik
        }
    } else {
        runningText.style.display = "none";
        if (nextPrayer === "Imsak") {
            if (nextPrayerText)
                nextPrayerText.textContent = `Imsak Kurang ${timeRemainingFormatted}`;
        } else {
            if (nextPrayerText)
                nextPrayerText.textContent = `Adzan ${nextPrayer} Kurang ${timeRemainingFormatted}`;
        }
        nextPrayerText.style.display = "block";
    }
}

// Fungsi untuk memperbarui jam dan menampilkan waktu azan
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Update digital clock
    const digitalClock = document.getElementById('digital-clock');
    digitalClock.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:<span class="seconds">${String(seconds).padStart(2, '0')}</span>`;

    // Perbarui pesan waktu sholat
    showPrayerTimeMessage(hours, minutes, seconds);

    // Update date
    const dateElement = document.getElementById('date');
    const day = now.getDate();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const dayIndex = now.getDay();

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    dateElement.innerText = `${days[dayIndex]}, ${String(day).padStart(2, '0')} ${months[monthIndex]} ${year}`;

    // Update analog clock hands
    const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;  // 30 deg per hour + fractional hour for minute
    const minuteDeg = (minutes * 6);  // 6 deg per minute
    const secondDeg = (seconds * 6);  // 6 deg per second

    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;

    // Refresh halaman setiap 10 menit (600000 ms)
    setInterval(function() {
        location.reload();  // Halaman akan di-refresh
    }, 600000); // 10 menit dalam milidetik
}

// Update jam setiap detik
setInterval(updateClock, 1000);
updateClock(); // Initial call to set the clock immediately
