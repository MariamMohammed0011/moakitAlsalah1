import { Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Prayer from "./Prayer";
import CountrySelector from "./CountrySelector";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function MainContent() {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "--:--",
    Dhuhr: "--:--",
    Asr: "--:--",
    Maghrib: "--:--",
    Isha: "--:--",
  });
  const [city, setCity] = useState("دمشق");
  const [date, setDate] = useState(new Date());
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState("00:00:00");
  const [nextPrayerName, setNextPrayerName] = useState("--");
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // دالة للتحكم بتوسعة البطاقات - باستخدام useCallback لمنع إعادة التقديم
  const handleToggleExpand = useCallback((cardId) => {
  console.log("تم النقر على البطاقة بالـ id:", cardId); // ← هذه جملة الكونسول
  setExpandedCardId(prevId => prevId === cardId ? null : cardId);
}, []);


  // دالة لتحويل الوقت من 12 ساعة إلى 24 ساعة
  const convertTo24Hour = (time12h) => {
    if (time12h === "--:--" || !time12h) return "--:--";
    
    const timeStr = time12h.trim();
    
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(':').map(num => num.padStart(2, '0'));
      return `${h}:${m}`;
    }
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
    if (!match) {
      console.error(`Invalid time format: ${time12h}`);
      return "--:--";
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3] ? match[3].toUpperCase() : '';
    
    if (modifier === 'AM') {
      if (hours === 12) {
        hours = 0;
      }
    } else if (modifier === 'PM') {
      if (hours !== 12) {
        hours += 12;
      }
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // دالة لجلب أوقات الصلاة باستخدام Aladhan API
  const fetchPrayerTimes = async (selectedCountry = "", selectedCity = "", useGeoLocation = false) => {
    try {
      setLoading(true);
      
      let url = "";
      
      if (useGeoLocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            url = `https://api.aladhan.com/v1/timingsByCity?city=Damascus&country=Syria&method=2`;
            await fetchFromAPI(url);
          },
          async (error) => {
            console.log("Geolocation failed, using Damascus");
            url = `https://api.aladhan.com/v1/timingsByCity?city=Damascus&country=Syria&method=2`;
            await fetchFromAPI(url);
          }
        );
      } else if (selectedCity && selectedCountry) {
        url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(selectedCity)}&country=${encodeURIComponent(selectedCountry)}&method=2`;
        await fetchFromAPI(url);
      } else {
        url = `https://api.aladhan.com/v1/timingsByCity?city=Damascus&country=Syria&method=2`;
        await fetchFromAPI(url);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setDefaultPrayerTimes();
    } finally {
      setLoading(false);
    }
  };

  const fetchFromAPI = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200) {
        const timings = data.data.timings;
        
        const cleanTime = (timeStr) => {
          if (!timeStr || timeStr === "--:--") return "--:--";
          
          let cleaned = timeStr.trim();
          
          if (cleaned.includes('AM') || cleaned.includes('PM') || 
              cleaned.includes('am') || cleaned.includes('pm')) {
            
            const [timePart, modifier] = cleaned.split(' ');
            let [hours, minutes] = timePart.split(':');
            
            hours = parseInt(hours);
            
            if (modifier.toUpperCase() === 'PM' && hours < 12) {
              hours += 12;
            } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
              hours = 0;
            }
            
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
          }
          
          return cleaned;
        };
        
        setPrayerTimes({
          Fajr: cleanTime(timings.Fajr),
          Dhuhr: cleanTime(timings.Dhuhr),
          Asr: cleanTime(timings.Asr),
          Maghrib: cleanTime(timings.Maghrib),
          Isha: cleanTime(timings.Isha),
        });
      }
    } catch (error) {
      console.error("Error in fetchFromAPI:", error);
      setDefaultPrayerTimes();
    }
  };

  const setDefaultPrayerTimes = () => {
    const defaultTimes = {
      Fajr: "05:30",
      Dhuhr: "12:15",
      Asr: "15:00",
      Maghrib: "17:30",
      Isha: "19:00",
    };
    setPrayerTimes(defaultTimes);
  };

  const handleLocationSelect = (selectedCountry, selectedStateCode, states = []) => {
    setCountry(selectedCountry);
    setState(selectedStateCode);

    const stateObj = states.find((s) => s.iso2 === selectedStateCode);
    const cityName = stateObj ? stateObj.name : selectedCountry;
    setCity(cityName);

    fetchPrayerTimes(selectedCountry, cityName, false);
  };

  useEffect(() => {
    fetchPrayerTimes("", "", true);
  }, []);

  useEffect(() => {
    const calculateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getTime();
      
      const prayers = [
        { name: "الفجر", time: prayerTimes.Fajr },
        { name: "الظهر", time: prayerTimes.Dhuhr },
        { name: "العصر", time: prayerTimes.Asr },
        { name: "المغرب", time: prayerTimes.Maghrib },
        { name: "العشاء", time: prayerTimes.Isha },
      ];

      let nextPrayer = null;
      let nextPrayerTime = null;
      let smallestDiff = Infinity;

      for (let prayer of prayers) {
        if (prayer.time === "--:--") continue;
        
        try {
          const [hours, minutes] = prayer.time.split(":").map(Number);
          
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);
          
          let diff = prayerDate.getTime() - currentTime;
          
          if (diff < 0) {
            diff += 24 * 60 * 60 * 1000;
          }
          
          if (diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayer = prayer.name;
            nextPrayerTime = new Date(currentTime + diff);
          }
        } catch (error) {
          console.error(`Error processing prayer ${prayer.name}:`, error);
        }
      }

      if (nextPrayer && nextPrayerTime) {
        setNextPrayerName(nextPrayer);
        
        const diff = smallestDiff;
        const totalSeconds = Math.floor(diff / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        setNextPrayerCountdown(
          `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        );
      } else {
        setNextPrayerName("--");
        setNextPrayerCountdown("00:00:00");
      }
    };

    const interval = setInterval(calculateNextPrayer, 1000);
    calculateNextPrayer();

    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    const updateDate = () => {
      setDate(new Date());
    };
    
    const dateInterval = setInterval(updateDate, 60000);
    return () => clearInterval(dateInterval);
  }, []);

  const handleRefresh = () => {
    if (city && country) {
      fetchPrayerTimes(country, city, false);
    } else {
      fetchPrayerTimes("", "", true);
    }
  };

  // دالة للحصول على وقت الصلاة الحالية - هذه كانت ناقصة
  const getCurrentPrayer = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const prayers = [
      { name: "الفجر", time: prayerTimes.Fajr },
      { name: "الظهر", time: prayerTimes.Dhuhr },
      { name: "العصر", time: prayerTimes.Asr },
      { name: "المغرب", time: prayerTimes.Maghrib },
      { name: "العشاء", time: prayerTimes.Isha },
    ];
    
    for (let i = prayers.length - 1; i >= 0; i--) {
      if (prayers[i].time !== "--:--" && !prayers[i].time.includes("undefined")) {
        const [prayerHour, prayerMinute] = prayers[i].time.split(":").map(Number);
        
        // تحقق إذا كان الوقت الحالي بعد وقت الصلاة
        if (currentHour > prayerHour || 
            (currentHour === prayerHour && currentMinute >= prayerMinute)) {
          return prayers[i].name;
        }
      }
    }
    
    return "لا يوجد"; // قبل الفجر
  };

  // إنشاء مصفوفة بيانات الصلوات
 const prayersData = useMemo(() => [
  {
    id: 1,
    title: "صلاة الفجر",
    subheader: "استفتح يومك بالصلاة",
    mediaImage: "/assets/alfajr.jpg",
    avatarLetter: "ف",
    rokaa: `👉 ركعتين سنة (قبل الفرض)
            👉 ركعتين فرض`,
    fadl: `قال النبي ﷺ: "ركعتا الفجر خير من الدنيا وما فيها"
            من صلى الفجر فهو في حفظ الله
            صلاة الفجر نور وبركة لبداية اليوم`,
    headerGradient: 'linear-gradient(45deg, #FFB74D, #FFA726)',
    avatarBorder: '#E67E22',
    time: prayerTimes.Fajr
  },
  {
    id: 2,
    title: "صلاة الظهر",
    subheader: "نصف اليوم بذكر الله",
    mediaImage: "/assets/aldohr.jpg",
    avatarLetter: "ظ",
    rokaa: `👉 ركعتين سنة قبل الفرض
            👉 أربع ركعات فرض
            👉 ركعتين سنة بعد الفرض`,
    fadl: `قال النبي ﷺ: "من صلى الظهر فهو في أمان الله"
            الصلاة في وقتها تحمي من الضياع والكسل`,
    headerGradient: 'linear-gradient(45deg, #4FC3F7, #0288D1)',
    avatarBorder: '#1565C0',
    time: prayerTimes.Dhuhr
  },
   {
      id: 3,
      title: "صلاة العصر",
      subheader: "لا تنساها وسط انشغالك",
      mediaImage: "/assets/الرياض_أثناء_فترة_العصر.jfif",
      avatarLetter: "ع",
      rokaa: `👉 ركعتين سنة قبل الفرض
              👉 أربع ركعات فرض`,
      fadl: `قال النبي ﷺ: "صلاة العصر نور وبركة لمن حافظ عليها"
              تذكير بأهمية الاجتهاد قبل نهاية اليوم`,
      headerGradient: 'linear-gradient(45deg, #81C784, #388E3C)',
      avatarBorder: '#2E7D32',
      time: prayerTimes.Asr
    },
    {
      id: 4,
      title: "صلاة المغرب",
      subheader: "لحظة شكر عند الغروب",
      mediaImage: "/assets/almgrb.jpg",
      avatarLetter: "م",
      rokaa: `👉 ثلاث ركعات فرض
              👉 ركعتين سنة بعد الفرض`,
      fadl: `قال النبي ﷺ: "صلاة المغرب تُضيء القلب والبيت"
              حفظ الوقت مهم لبركة المساء`,
      headerGradient: 'linear-gradient(45deg, #FF8A65, #D84315)',
      avatarBorder: '#D84315',
      time: prayerTimes.Maghrib
    },
    {
      id: 5,
      title: "صلاة العشاء",
      subheader: "طمأنينة قبل النوم",
      mediaImage: "/assets/images.jfif",
      avatarLetter: "عش",
      rokaa: `👉 أربع ركعات فرض
              👉 ركعتين سنة بعد الفرض`,
      fadl: `قال النبي ﷺ: "من حافظ على العشاء كان في حفظ الله"
              ختام اليوم بالذكر يزيد الاطمئنان والراحة`,
      headerGradient: 'linear-gradient(45deg, #9575CD, #512DA8)',
      avatarBorder: '#512DA8',
      time: prayerTimes.Isha
    }
], [prayerTimes]);

   


  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="space-around"
        sx={{
          px: 3,
          py: 2,
          color: "white",
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "10px",
          margin: "10px"
        }}
      >
        <Grid item xs={4}>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
              {date.toLocaleDateString("ar-SA", { 
                day: "numeric", 
                month: "long", 
                year: "numeric",
                weekday: "long"
              })}
            </h2>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              {city} {loading && "(جاري التحميل...)"}
            </h1>
            <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
              الصلاة الحالية: {getCurrentPrayer()}
            </p>
          </div>
        </Grid>

        <Grid item xs={4} style={{ textAlign: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
              متبقي حتى صلاة {nextPrayerName}
            </h2>
            <h1 style={{ 
              margin: 0, 
              fontSize: "34px", 
              color: "#FFD700",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)"
            }}>
              {nextPrayerCountdown}
            </h1>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: 0.1, margin: "20px 0" }} />

   <Grid
  container
  spacing={0.5}
  sx={{ marginTop: "20px", overflow: "visible" }} // مهم!
>
  {prayersData.map((prayer) => (
    <Grid item xs={12} sm={4} md={2} key={prayer.id} sx={{ position: "relative", overflow: "visible" }}>
      <Prayer
        {...prayer}
        isExpanded={expandedCardId === prayer.id}
        onToggleExpand={handleToggleExpand}
      />
    </Grid>
  ))}
</Grid>


      <div style={{ marginTop: "30px", padding: "20px" }}>
        <CountrySelector onLocationSelect={handleLocationSelect} />
      </div>
    </div>
  );
}