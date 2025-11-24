import TertiaryHeading from "../../headings/TertiaryHeading";

import mountain from "../../../images/about-page/mountain.png";
import target from "../../../images/about-page/target.png";
import img1 from "../../../images/about-page/img1.webp";
import img2 from "../../../images/about-page/img2.jpg";

function History() {
  return (
    <section className="bg-[url('./images/about-page/bg.png')] bg-cover px-6 py-32 text-center">
    <div className="container grid shadow-2xl xl:grid-cols-2 ">
      <div className="flex h-full flex-col gap-4 self-center bg-white p-4">
        <img
          src={target}
          alt=""
          className="hover:rotate-y-180 mx-auto w-32 transition-all duration-700"
        />
        <TertiaryHeading>تاريخنا</TertiaryHeading><div className="space-y-6 text-gray-300 font-medium">
  <p>
    بدأت رحلتنا عام 2017 عندما تولّينا الإداره الثانيه لجيم مركز شباب بهبشين في وقت كانت فيه الإمكانيات شبه معدومة...
  </p>

  <p>
    وفي عام 2019 انتقلنا لمرحلة جديدة بافتتاح أول جيم خاص في بهبشين، مقدّمين لأول مرة داخل القرية تجهيزات أفضل...
  </p>

  <p>
    ومع تطوير مركز الشباب وتجديده، عدنا عام 2023 لتولّي الإدارة الثالثة للجيم، وواصلنا النجاح من جديد...
  </p>

  <p>
    واليوم، في عام 2025، أصبح إيجل جيم (شاذلي جيم) الاسم الأول في بهبشين والأقوى بين جيمات مركز ناصر...
  </p>
</div>

      </div>
  
      <div className="overflow-hidden">
        <img
          src={img1}
          alt=""
          className="h-full transition-all duration-300 hover:scale-110"
        />
      </div>
  
      <div className="flex h-full flex-col gap-4 self-center bg-white p-4 xl:order-4">
        <img
          src={mountain}
          alt=""
          className="hover:rotate-y-180 mx-auto transition-all duration-700"
        />
        <TertiaryHeading>مهمتنا</TertiaryHeading>
        <p className="font-medium text-gray-300">
          رؤيتنا هي تحقيق التميز من خلال الابتكار والإخلاص في العمل، وتقديم
          حلول فعالة تلبي احتياجات عملائنا في بناء جسم أفضل للجميع.
        </p>
      </div>
  
      <div className="overflow-hidden">
        <img
          src={img2}
          alt=""
          className="h-full transition-all duration-300 hover:scale-110"
        />
      </div>
    </div>
  </section>
  
  );
}

export default History;
