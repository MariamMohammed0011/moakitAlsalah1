import { Divider, Stack } from "@mui/material";
import { yellow } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Prayer from "./Prayer";
import CountrySelector from "./CountrySelector";
import { useState } from "react";
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
  const fetchPrayerTimes = async (countryCode, stateCode) => {
    if (!countryCode || !stateCode) return;

    try {
      // هنا لازم تستخدم أي API حقيقي لأوقات الصلاة حسب الدولة/المحافظة
      // مثال API افتراضي
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${stateCode}&country=${countryCode}&method=2`
      );
      const data = await response.json();

      setPrayerTimes({
        Fajr: data.data.timings.Fajr,
        Dhuhr: data.data.timings.Dhuhr,
        Asr: data.data.timings.Asr,
        Maghrib: data.data.timings.Maghrib,
        Isha: data.data.timings.Isha,
      });
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };
 const handleLocationSelect = (selectedCountry, selectedState) => {
    setCountry(selectedCountry);
    setState(selectedState);
    fetchPrayerTimes(selectedCountry, selectedState);
  };
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
        }}
      >
        <Grid item xs={6}>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
              فبراير 8 / 2026
            </h2>
            <h1 style={{ margin: 0, fontSize: "34px" }}>ريف دمشق</h1>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div style={{ textAlign: "left" }}>
            <h2 style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
              متبقي حتى صلاة العصر
            </h2>
            <h1 style={{ margin: 0, fontSize: "34px" }}>00:10:44</h1>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: 0.1 }} />
      <Stack
        direction={"row"}
        flexWrap="wrap"  
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
         gap={0.7}  
      >
        <Prayer
          title="صلاة الفجر"
          subheader="استفتح يومك بالصلاة"
          mediaImage="../../public/assets/alfajr.jpg"
          avatarLetter="ف"
          rokaa={
            <>
              👉 ركعتين سنة (قبل الفرض)
              <br />
              👉 ركعتين فرض
            <br />
            </>
          }
          fadl={
            <>
              قال النبي ﷺ: "ركعتا الفجر خير من الدنيا وما فيها"
              <br />
              من صلى الفجر فهو في حفظ الله
              <br />
              صلاة الفجر نور وبركة لبداية اليوم
            <br />
            </>
          }
          headerGradient={'linear-gradient(45deg, #FFB74D, #FFA726)'}
         avatarBorder={'#E67E22'}
         time={prayerTimes.Fajr}
        />

        <Prayer
          title={"صلاة الظهر"}
          subheader={"نصف اليوم بذكر الله"}
          mediaImage="../../public/assets/aldohr.jpg"
          avatarLetter="ظ"
          rokaa={
            <>
              👉 ركعتين سنة قبل الفرض
              <br />
              👉 أربع ركعات فرض
              <br />
              👉 ركعتين سنة بعد الفرض
            </>
          }
          fadl={
            <>
              قال النبي ﷺ: "من صلى الظهر فهو في أمان الله"
              <br />
              الصلاة في وقتها تحمي من الضياع والكسل
            </>
          }
            headerGradient={'linear-gradient(45deg, #4FC3F7, #0288D1)'}
           avatarBorder={'#1565C0'}
           time={prayerTimes.Dhuhr}
        />
        <Prayer
          title={"صلاة العصر"}
          subheader={"لا تنساها وسط انشغالك"}
          mediaImage={"../../public/assets/الرياض_أثناء_فترة_العصر.jfif"}
          avatarLetter={"ع"}
          rokaa={
            <>
              👉 ركعتين سنة قبل الفرض
              <br />
              👉 أربع ركعات فرض
            </>
          }
          fadl={
            <>
              قال النبي ﷺ: "صلاة العصر نور وبركة لمن حافظ عليها"
              <br />
              تذكير بأهمية الاجتهاد قبل نهاية اليوم
            </>
          }
            headerGradient={'linear-gradient(45deg, #81C784, #388E3C)'}
            avatarBorder={'#2E7D32'}
             time={prayerTimes.Asr}
        />

        <Prayer
          title={"صلاة المغرب"}
          subheader={"لحظة شكر عند الغروب"}
          mediaImage={"../../public/assets/almgrb.jpg"}
          avatarLetter={"م"}
          rokaa={
            <>
              👉 ثلاث ركعات فرض
              <br />
              👉 ركعتين سنة بعد الفرض
            </>
          }
          fadl={
            <>
              قال النبي ﷺ: "صلاة المغرب تُضيء القلب والبيت"
              <br />
              حفظ الوقت مهم لبركة المساء
            </>
          }
            headerGradient={'linear-gradient(45deg, #FF8A65, #D84315)'}
            avatarBorder={'#D84315'}
             time={prayerTimes.Maghrib}
        />

        <Prayer
          title={"صلاة العشاء"}
          subheader={"طمأنينة قبل النوم"}
          mediaImage={"../../public/assets/images.jfif"}
          avatarLetter={"عش"}
          rokaa={
            <>
              👉 أربع ركعات فرض
              <br />
              👉 ركعتين سنة بعد الفرض
            </>
          }
          fadl={
            <>
              قال النبي ﷺ: "من حافظ على العشاء كان في حفظ الله"
              <br />
              ختام اليوم بالذكر يزيد الاطمئنان والراحة
            </>
          }
            headerGradient={'linear-gradient(45deg, #9575CD, #512DA8)'}
            avatarBorder={'#512DA8'}
            time={prayerTimes.Isha}
        />
      </Stack>
       <CountrySelector onLocationSelect={handleLocationSelect} />

    </div>
  );
}
