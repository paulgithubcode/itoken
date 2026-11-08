import { publicTranslations } from './public-translations.js';

export function initializeThemeSwitchers({ root = document, theme = window.iTokenTheme, events = window } = {}) {
    const switchers = [...root.querySelectorAll('[data-theme-switcher]')];
    if (!switchers.length || !theme) return;

    const closeSwitcher = (switcher, { restoreFocus = false } = {}) => {
        const toggle = switcher.querySelector('[data-theme-switcher-toggle]');
        const menu = switcher.querySelector('[data-theme-switcher-menu]');
        if (!toggle || !menu || menu.hidden) return;

        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (restoreFocus) toggle.focus();
    };

    const syncChoices = () => {
        const preference = theme.getPreference();
        switchers.forEach((switcher) => {
            switcher.querySelectorAll('[data-theme-choice]').forEach((choice) => {
                const selected = choice.dataset.themeChoice === preference;
                choice.setAttribute('aria-checked', String(selected));
                choice.classList.toggle('theme-switcher-choice-selected', selected);
                choice.querySelector('[data-theme-selection-indicator]')?.toggleAttribute('hidden', !selected);
            });
        });
    };

    const selectedMessage = (preference) => {
        const locale = root.documentElement?.lang === 'zh-CN'
            ? 'zh_CN'
            : (root.documentElement?.lang ?? 'id');
        const dictionary = publicTranslations[locale] ?? publicTranslations.id;

        return dictionary[`theme.switcher.selected.${preference}`] ?? dictionary['theme.switcher.selected.system'];
    };

    const choicesFor = (switcher) => [...switcher.querySelectorAll('[data-theme-choice]')];

    const selectChoice = (switcher, choice) => {
        const preference = choice.dataset.themeChoice;
        theme.setPreference(preference);
        syncChoices();
        switchers.forEach((item) => {
            const status = item.querySelector('[data-theme-switcher-status]');
            if (status) status.textContent = selectedMessage(preference);
        });
        closeSwitcher(switcher, { restoreFocus: true });
    };

    switchers.forEach((switcher) => {
        const toggle = switcher.querySelector('[data-theme-switcher-toggle]');
        const menu = switcher.querySelector('[data-theme-switcher-menu]');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const shouldOpen = menu.hidden;
            switchers.forEach((item) => closeSwitcher(item));
            if (!shouldOpen) return;

            syncChoices();
            menu.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            choicesFor(switcher).find((choice) => choice.dataset.themeChoice === theme.getPreference())?.focus();
        });

        choicesFor(switcher).forEach((choice) => {
            choice.addEventListener('click', () => selectChoice(switcher, choice));
            choice.addEventListener('keydown', (event) => {
                const choices = choicesFor(switcher);
                const currentIndex = choices.indexOf(choice);
                let nextIndex;

                switch (event.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        nextIndex = (currentIndex + 1) % choices.length;
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        nextIndex = (currentIndex - 1 + choices.length) % choices.length;
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = choices.length - 1;
                        break;
                    case 'Enter':
                    case ' ':
                        event.preventDefault();
                        selectChoice(switcher, choice);
                        return;
                    default:
                        return;
                }

                event.preventDefault();
                choices[nextIndex]?.focus();
            });
        });
    });

    root.addEventListener('click', (event) => {
        switchers.forEach((switcher) => {
            if (!switcher.contains(event.target)) closeSwitcher(switcher);
        });
    });

    root.addEventListener('keydown', (event) => {
        const openSwitcher = switchers.find((switcher) => !switcher.querySelector('[data-theme-switcher-menu]')?.hidden);
        if (!openSwitcher) return;

        if (event.key === 'Tab') {
            closeSwitcher(openSwitcher, { restoreFocus: true });
            return;
        }
        if (event.key !== 'Escape') return;

        event.preventDefault();
        closeSwitcher(openSwitcher, { restoreFocus: true });
    });

    events.addEventListener('storage', syncChoices);
    events.addEventListener('pageshow', syncChoices);
    syncChoices();
}
