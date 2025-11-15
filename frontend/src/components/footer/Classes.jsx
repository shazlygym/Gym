import { Link } from "react-router-dom";

const linkStyles = `focus font-medium text-gray-300 transition-all duration-300 hover:ml-2 hover:text-red`;

function Classes() {
  return (
    <div className="space-y-5 2xl:w-48 2xl:justify-self-center">
      <h4 className="relative pb-2 text-xl font-semibold capitalize before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red">
        حصصنا
      </h4>
      <ul className="space-y-5">
        <li>
          <Link className={linkStyles}>حصص اللياقة البدنية</Link>
        </li>
        <li>
          <Link className={linkStyles}>حصص الأيروبيك</Link>
        </li>
        <li>
          <Link className={linkStyles}>حصص التأمل</Link>
        </li>
        <li>
          <Link className={linkStyles}>آلات الرشاقة</Link>
        </li>
        <li>
          <Link className={linkStyles}>قوة الجسم الكاملة</Link>
        </li>
      </ul>
    </div>
  );
}

export default Classes;
