import SecondaryHeading from "../../headings/SecondaryHeading";
import TertiaryHeading from "../../headings/TertiaryHeading";

function Title() {
  return (
    <div>
      <SecondaryHeading>من نحن</SecondaryHeading>
      <TertiaryHeading>نمنحك القوة والصحة</TertiaryHeading>
      <p className="font-medium text-gray-300">
        تأسس جيمات بهدف مساعدة الأفراد على تحقيق أهدافهم في اللياقة البدنية من خلال
        برامج تدريب احترافية ومعدات حديثة. نسعى دائمًا لتقديم بيئة مشجعة وصحية
        تساعدك على الوصول إلى أفضل نسخة من نفسك جسديًا وذهنيًا.
      </p>
    </div>
  );
}

export default Title;
