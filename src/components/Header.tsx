"use client";

export default function Header() {
  return (
    <header className="
      h-16
      bg-white
      border-b
      border-gray-200
      flex
      items-center
      justify-between
      px-8
    ">

      <div>

        <p className="
          text-sm
          text-gray-500
        ">
          Sistem Kartu Ujian
        </p>

      </div>


      <div className="
        flex
        items-center
        gap-3
      ">

        <div className="
          text-right
        ">

          <p className="
            text-sm
            font-semibold
            text-gray-800
          ">
            Admin TU
          </p>

          <p className="
            text-xs
            text-gray-500
          ">
            SMK Ekonomika
          </p>

        </div>


        <div className="
          w-10
          h-10
          rounded-full
          bg-blue-100
          text-blue-700
          flex
          items-center
          justify-center
          font-bold
        ">
          A
        </div>

      </div>

    </header>
  );
}