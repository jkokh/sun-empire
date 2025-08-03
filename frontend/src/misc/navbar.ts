export const navbar = () => {
    const nav = document.querySelector('#navbar .small') as HTMLElement;
    const bigLogo = document.querySelector('#navbar .big-logo .logo') as HTMLElement;
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 80) {
            nav.style.transform = 'translateY(0)'; // Moves the navbar into view
            if (bigLogo) bigLogo.style.transform = 'translateY(-35%)';
        } else {
            nav.style.transform = 'translateY(-100%)'; // Hides the navbar
            if (bigLogo) bigLogo.style.transform = 'translateY(0)';
        }
    });
}

