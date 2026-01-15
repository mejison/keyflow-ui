<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-4xl px-4 py-12">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/30 p-8 md:p-12">
        <h1 class="text-4xl font-bold text-slate-50 mb-4">Privacy Policy</h1>
        <p class="text-slate-400 mb-8">Last updated: January 14, 2026</p>

        <div class="space-y-8 text-slate-300">
          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">1. Introduction</h2>
            <p class="leading-relaxed">
              Welcome to KeyFlow. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">2. Information We Collect</h2>
            <p class="leading-relaxed mb-4">We collect the following types of information:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Name, email address, and password when you register</li>
              <li><strong>Profile Information:</strong> Avatar, display name, and profile preferences</li>
              <li><strong>Typing Test Data:</strong> Words per minute (WPM), accuracy, test duration, timestamps</li>
              <li><strong>OAuth Data:</strong> When using Google or GitHub login, we receive your name, email, and profile picture</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, and IP address</li>
              <li><strong>Settings & Preferences:</strong> Font size, test duration, sound preferences</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">3. How We Use Your Information</h2>
            <p class="leading-relaxed mb-4">We use your data to:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain the KeyFlow typing test service</li>
              <li>Track your typing progress and statistics over time</li>
              <li>Display your rankings on the leaderboard</li>
              <li>Personalize your experience with custom settings</li>
              <li>Send password reset emails and important account notifications</li>
              <li>Improve our service through analytics and user behavior insights</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">4. Data Storage and Security</h2>
            <p class="leading-relaxed mb-4">
              Your data is stored securely in our database with industry-standard encryption. We implement:
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Encrypted password storage using bcrypt hashing</li>
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure token-based authentication (Bearer tokens)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">5. Cookies and Local Storage</h2>
            <p class="leading-relaxed mb-4">
              We use cookies and browser local storage for:
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Authentication tokens to keep you logged in</li>
              <li>User preferences and settings</li>
              <li>Language selection</li>
              <li>CSRF protection</li>
            </ul>
            <p class="leading-relaxed mt-4">
              You can clear cookies and local storage through your browser settings, but this will log you out 
              and reset your preferences.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">6. Third-Party Services</h2>
            <p class="leading-relaxed mb-4">We use the following third-party services:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google OAuth:</strong> For Google sign-in authentication</li>
              <li><strong>GitHub OAuth:</strong> For GitHub sign-in authentication</li>
            </ul>
            <p class="leading-relaxed mt-4">
              When you use OAuth login, you're subject to the privacy policies of Google or GitHub. 
              We only receive the information you authorize them to share with us.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">7. Data Sharing</h2>
            <p class="leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. Your typing statistics 
              and rankings are displayed publicly on the leaderboard with your chosen display name. Your email 
              address is never shown publicly.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">8. Your Rights</h2>
            <p class="leading-relaxed mb-4">You have the right to:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your typing statistics and test history</li>
              <li>Opt out of non-essential data collection</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">9. Children's Privacy</h2>
            <p class="leading-relaxed">
              KeyFlow is not intended for users under the age of 13. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child 
              under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">10. Changes to This Policy</h2>
            <p class="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last updated" date. You are advised to 
              review this policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">11. Contact Us</h2>
            <p class="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <a href="mailto:privacy@keyflow.click" class="text-primary hover:text-primary ml-1">privacy@keyflow.click</a>
            </p>
          </section>
        </div>

        <div class="mt-12 pt-6 border-t border-slate-700">
          <RouterLink to="/" class="text-primary hover:text-primary inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
