<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-4xl px-4 py-12">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/30 p-8 md:p-12">
        <h1 class="text-4xl font-bold text-slate-50 mb-4">Security Policy</h1>
        <p class="text-slate-400 mb-8">Last updated: January 14, 2026</p>

        <div class="space-y-8 text-slate-300">
          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">1. Our Commitment to Security</h2>
            <p class="leading-relaxed">
              At KeyFlow, we take the security of your data seriously. This policy outlines the security 
              measures we have implemented to protect your information and how we handle security-related 
              incidents.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">2. Data Encryption</h2>
            <p class="leading-relaxed mb-4">We implement multiple layers of encryption:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>HTTPS/TLS:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS 1.3</li>
              <li><strong>Password Hashing:</strong> Passwords are hashed using bcrypt with a high cost factor before storage</li>
              <li><strong>Database Encryption:</strong> Sensitive data is encrypted at rest in our database</li>
              <li><strong>Token Security:</strong> Authentication tokens use cryptographically secure random generation</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">3. Authentication & Authorization</h2>
            <p class="leading-relaxed mb-4">Our authentication system includes:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Laravel Sanctum:</strong> Token-based authentication with automatic expiration</li>
              <li><strong>OAuth 2.0:</strong> Secure third-party authentication via Google and GitHub</li>
              <li><strong>CSRF Protection:</strong> Cross-Site Request Forgery tokens on all state-changing operations</li>
              <li><strong>Rate Limiting:</strong> Protection against brute force attacks and API abuse</li>
              <li><strong>Session Management:</strong> Automatic logout after extended inactivity</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">4. Infrastructure Security</h2>
            <p class="leading-relaxed mb-4">Our infrastructure includes:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Regular security patches and updates</li>
              <li>Firewall protection and network segmentation</li>
              <li>Intrusion detection and prevention systems</li>
              <li>Regular automated backups with encryption</li>
              <li>DDoS protection and mitigation</li>
              <li>Server hardening and access controls</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">5. Application Security</h2>
            <p class="leading-relaxed mb-4">We protect against common vulnerabilities:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>SQL Injection:</strong> Parameterized queries and ORM usage</li>
              <li><strong>XSS (Cross-Site Scripting):</strong> Input sanitization and output encoding</li>
              <li><strong>CSRF:</strong> Token-based protection on all forms</li>
              <li><strong>Clickjacking:</strong> X-Frame-Options headers</li>
              <li><strong>Content Security Policy:</strong> Strict CSP headers to prevent unauthorized script execution</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">6. OAuth Security</h2>
            <p class="leading-relaxed mb-4">When using OAuth providers:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>State parameter validation prevents CSRF attacks</li>
              <li>Authorization codes are exchanged server-side only</li>
              <li>Client secrets never exposed to the frontend</li>
              <li>Redirect URIs are strictly validated</li>
              <li>Tokens are securely stored and transmitted</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">7. Data Access Controls</h2>
            <p class="leading-relaxed mb-4">We implement strict access controls:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Role-based access control (RBAC) for administrative functions</li>
              <li>Principle of least privilege for all system components</li>
              <li>Multi-factor authentication for administrator accounts</li>
              <li>Audit logging of all administrative actions</li>
              <li>Regular access reviews and permission audits</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">8. Monitoring & Logging</h2>
            <p class="leading-relaxed mb-4">We maintain comprehensive security monitoring:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Real-time security event monitoring</li>
              <li>Failed login attempt tracking</li>
              <li>Anomaly detection for unusual activity patterns</li>
              <li>Automated alerts for security incidents</li>
              <li>Regular log reviews and analysis</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">9. Vulnerability Management</h2>
            <p class="leading-relaxed mb-4">Our vulnerability management process includes:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Regular security assessments and penetration testing</li>
              <li>Dependency scanning for known vulnerabilities</li>
              <li>Rapid patching of critical security issues</li>
              <li>Security-focused code reviews</li>
              <li>Bug bounty program (coming soon)</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">10. Incident Response</h2>
            <p class="leading-relaxed mb-4">In the event of a security incident:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>We will identify and contain the incident within 24 hours</li>
              <li>Affected users will be notified within 72 hours</li>
              <li>We will conduct a thorough investigation</li>
              <li>Remediation steps will be implemented immediately</li>
              <li>A post-mortem report will be published</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">11. User Security Best Practices</h2>
            <p class="leading-relaxed mb-4">We recommend users:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Use strong, unique passwords (minimum 8 characters)</li>
              <li>Enable two-factor authentication when available</li>
              <li>Keep your email address secure</li>
              <li>Log out from shared or public computers</li>
              <li>Report suspicious activity immediately</li>
              <li>Regularly review your account activity</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">12. Responsible Disclosure</h2>
            <p class="leading-relaxed mb-4">
              If you discover a security vulnerability in KeyFlow, we encourage responsible disclosure:
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Email us at <a href="mailto:security@keyflow.app" class="text-primary hover:text-primary">security@keyflow.app</a></li>
              <li>Provide detailed information about the vulnerability</li>
              <li>Allow us reasonable time to address the issue before public disclosure</li>
              <li>We commit to acknowledging reports within 48 hours</li>
            </ul>
            <p class="leading-relaxed mt-4">
              We appreciate the security research community's efforts and will credit researchers 
              (with permission) for responsible disclosures.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">13. Compliance</h2>
            <p class="leading-relaxed">
              KeyFlow complies with applicable data protection regulations including GDPR and CCPA. 
              We regularly review our security practices to ensure alignment with industry standards 
              and best practices.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">14. Updates to This Policy</h2>
            <p class="leading-relaxed">
              This security policy is reviewed and updated regularly. Material changes will be 
              announced via email to registered users. The "Last updated" date at the top of this 
              page indicates when changes were last made.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-50 mb-4">15. Contact Information</h2>
            <p class="leading-relaxed">
              For security concerns or questions, contact our security team at:
              <a href="mailto:security@keyflow.app" class="text-primary hover:text-primary ml-1">security@keyflow.app</a>
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
