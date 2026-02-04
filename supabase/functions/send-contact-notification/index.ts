import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, subject, message }: ContactNotificationRequest = await req.json();

    console.log("Sending contact notification email for:", { name, email, subject });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ATROUN Contact <onboarding@resend.dev>",
      to: ["atroun.bd@gmail.com"],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="padding: 20px; border-left: 4px solid #2d5016;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This message was sent via the ATROUN Bio-Dynamics contact form.
          </p>
        </div>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    // Send confirmation email to the submitter
    const confirmationEmailResponse = await resend.emails.send({
      from: "ATROUN Bio-Dynamics <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message - ATROUN Bio-Dynamics",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Thank you for reaching out, ${name}!</h2>
          <p>We have received your message regarding "<strong>${subject}</strong>" and will get back to you within 48 hours.</p>
          <div style="background-color: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d5016;">Your Message:</h3>
            <p style="white-space: pre-wrap; color: #666;">${message}</p>
          </div>
          <p>In the meantime, feel free to explore more about our work at <a href="https://atroun.com" style="color: #2d5016;">atroun.com</a>.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            ATROUN Bio-Dynamics<br>
            Uganda, East Africa
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent to submitter:", confirmationEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        confirmationEmail: confirmationEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
