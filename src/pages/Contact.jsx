import { useState } from "react";
import siteConfig from "../siteConfig";
import useDocumentHead from "../hooks/useDocumentHead";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", _hp: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useDocumentHead({
    title: `Contact — ${siteConfig.businessName}`,
    description: "Press or business inquiries for RubyxQube Games.",
    url: `${siteConfig.domain}/contact`,
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section contact-page">
      <div className="contact-inner">
        <div className="contact-info">
          <span className="eyebrow">Contact</span>
          <h1>Get in Touch</h1>
          <p>
            Press inquiry, business question, or just want to say hi? Send a message and we'll
            get back to you.
          </p>
          <div className="contact-details">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
        </div>

        <div className="contact-form-wrap">
          {status === "sent" ? (
            <div className="contact-success">
              <h3>Message sent!</h3>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <label>
                Name
                <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} required value={form.message} onChange={handleChange} placeholder="What's up?" />
              </label>
              {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
              <input
                type="text"
                name="_hp"
                value={form._hp}
                onChange={handleChange}
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {status === "error" && (
                <p className="form-error">Something went wrong — please email us directly at {siteConfig.email}.</p>
              )}
              <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
