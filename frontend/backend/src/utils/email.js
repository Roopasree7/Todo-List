import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

export const sendTaskMail = (to, task) => {
  const html = `<h1>Task: ${task.title}</h1>
    <a href="${process.env.BACKEND_URL}/tasks/${task.id}/markdone?token=...">Mark Done</a>`;
  return transporter.sendMail({ to, subject: "New Task", html });
};
