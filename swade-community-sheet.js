import SwadeCharacterSheet from './module/SwadeCharacterSheet';

Hooks.on('init', () => {
  Actors.registerSheet('swade-community-sheet', SwadeCharacterSheet, {
    types: ['character'],
    label: 'SWS.CommunityCharSheet',
  });

  preloadHandlebarsTemplates();
});

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    //Character Sheet
    'modules/swade-community-sheet/templates/character-sheet.html',
    'modules/swade-community-sheet/templates/partials/attributes.html',
    'modules/swade-community-sheet/templates/partials/summary-tab.html',
    'modules/swade-community-sheet/templates/partials/edges-tab.html',
    'modules/swade-community-sheet/templates/partials/inventory-tab.html',
    'modules/swade-community-sheet/templates/partials/powers-tab.html',
    'modules/swade-community-sheet/templates/partials/biography-tab.html',
    'modules/swade-community-sheet/templates/setting-fields.html',
    //Gear Cards
    'modules/swade-community-sheet/templates/partials/weapon-card.html',
    'modules/swade-community-sheet/templates/partials/armor-card.html',
    'modules/swade-community-sheet/templates/partials/powers-card.html',
    'modules/swade-community-sheet/templates/partials/shield-card.html',
    'modules/swade-community-sheet/templates/partials/misc-card.html',
    //die type list
    'modules/swade-community-sheet/templates/die-sides-options.html',
  ];
  return loadTemplates(templatePaths);
}
