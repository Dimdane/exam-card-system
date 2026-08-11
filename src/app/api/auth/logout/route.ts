import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil.",
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader =
              request.headers.get("cookie") || "";

            return cookieHeader
              .split(";")
              .filter(Boolean)
              .map((cookie) => {
                const index = cookie.indexOf("=");

                return {
                  name: cookie
                    .slice(0, index)
                    .trim(),

                  value: decodeURIComponent(
                    cookie
                      .slice(index + 1)
                      .trim()
                  ),
                };
              });
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                response.cookies.set({
                  name,
                  value,
                  ...options,
                });
              }
            );
          },
        },
      }
    );

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Supabase Logout Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return response;
  } catch (error) {
    console.error(
      "Logout API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan saat logout.",
      },
      {
        status: 500,
      }
    );
  }
}