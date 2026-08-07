import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Valid email and password (min 6 characters) are required.' },
        { status: 400 }
      );
    }

    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role: 'user',
      savedCities: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // --- SEND EMAIL NOTIFICATION TO ADMIN ---
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'weatherweb-noreply@example.com',
        to: 'amann042310@gmail.com',
        subject: `New User Registration: ${email}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; border-radius: 10px;">
            <h2 style="color: #0891b2;">WeatherWeb - New User Alert! 🎉</h2>
            <p style="font-size: 16px; color: #333;">A new user has just signed up on your platform.</p>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>User Email:</strong> ${email}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Total Users Now:</strong> ${users.length}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Keep building awesome things!</p>
          </div>
        `
      });
      console.log(`Notification email sent for user ${email}`);
    } catch (mailError) {
      console.error('Failed to send notification email (check env vars):', mailError);
    }
    // ----------------------------------------

    // Remove password before sending to client
    const { password: _, ...userWithoutPassword } = newUser;
    const fakeToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({ 
      token: fakeToken, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error during signup.' },
      { status: 500 }
    );
  }
}
