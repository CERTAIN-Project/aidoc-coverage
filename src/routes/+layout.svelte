<script lang="ts">
  import '../app.css';
  import {
    DarkMode,
    Footer,
    FooterCopyright,
    FooterLink,
    FooterLinkGroup,
    NavBrand,
    NavHamburger,
    NavLi,
    Navbar,
    NavUl
  } from 'flowbite-svelte';
</script>

<div class="flex min-h-screen flex-col">
  <Navbar class="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 p-0">
    <NavBrand href="/" class="font-semibold text-slate-900 dark:text-slate-100">
      <span class="self-center whitespace-nowrap text-lg">CERTAIN Coverage</span>
    </NavBrand>

    <div class="flex items-center gap-2 md:order-2">
      <DarkMode class="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" />
      <NavHamburger class="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" />
    </div>

    <NavUl class="md:order-1" ulClass="mt-4 md:mt-0">
      <NavLi href="/">Dashboard</NavLi>
      <NavLi href="/results">Results</NavLi>
    </NavUl>
  </Navbar>

  <main class="flex-1">
    <slot />
  </main>

  <!-- fixed -->
  <Footer class="inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <FooterCopyright
        by="CERTAIN"
        href="/"
        class="text-sm text-slate-600 dark:text-slate-300"
        copyrightMessage="All rights reserved."
      />
      <FooterLinkGroup class="flex gap-4 text-sm">
        <FooterLink href="/legal-information">Legal information</FooterLink>
        <FooterLink href="/privacy">Privacy</FooterLink>
      </FooterLinkGroup>
    </div>
  </Footer>
</div>
