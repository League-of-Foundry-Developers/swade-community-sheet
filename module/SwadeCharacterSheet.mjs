import SwadeBaseActorSheet from './SwadeBaseActorSheet.mjs';
export default class SwadeCharacterSheet extends SwadeBaseActorSheet {
  /**
   * Extend and override the default options used by the Actor Sheet
   * @returns {Object}
   */
  static get defaultOptions() {
    const options = mergeObject(super.defaultOptions, {
      classes: ['swade', 'sheet', 'actor', 'character'],
      width: 630,
      height: 768,
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: '.sheet-body',
          initial: 'summary',
        },
      ],
      scrollY: [
        '.skills .skills-list',
        '.quickaccess-list',
        '.inventory .inventory-categories',
      ],
    });
    options['activeArcane'] = 'All';
    return options;
  }
  _createEditor(target, editorOptions, initialContent) {
    // remove some controls to the editor as the space is lacking
    if (target == 'data.advances.details') {
      editorOptions.toolbar =
        'styleselect bullist hr table removeFormat code save ';
    }
    super._createEditor(target, editorOptions, initialContent);
  }
  get template() {
    // Later you might want to return a different template
    // based on user permissions.
    return 'modules/swade-community-sheet/templates/character-sheet.html';
  }
  // Override to set resizable initial size
  async _renderInner(data, options) {
    const html = await super._renderInner(data, options);
    this.form = html[0];
    // Resize resizable classes
    const resizable = html.find('.resizable');
    resizable.each((_, el) => {
      const heightDelta = this.position.height - this.options.height;
      el.style.height = `${heightDelta + parseInt(el.dataset.baseSize)}px`;
    });
    // Filter power list
    const arcane = !this.options['activeArcane']
      ? 'All'
      : this.options['activeArcane'];
    html.find('.arcane-tabs .arcane').removeClass('active');
    html.find(`[data-arcane='${arcane}']`).addClass('active');
    this._filterPowers(html, arcane);
    return html;
  }
  activateListeners(html) {
    super.activateListeners(html);
    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
    // Drag events for macros.
    if (this.actor.owner) {
      const handler = (ev) => this._onDragStart(ev);
      // Find all items on the character sheet.
      html.find('li.item.skill').each((i, li) => {
        // Add draggable attribute and dragstart listener.
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', handler, false);
      });
      html.find('li.item.weapon').each((i, li) => {
        // Add draggable attribute and dragstart listener.
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', handler, false);
      });
      html.find('div.power.item').each((i, li) => {
        // Add draggable attribute and dragstart listener.
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', handler, false);
      });
    }
    // Delete Item
    html.find('.item-delete').on('click', async (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const ownedItem = this.actor.getOwnedItem(li.data('itemId'));
      const template = `
      <form>
        <div>
          <center>${game.i18n.localize('SWADE.Del')} 
            <strong>${ownedItem.name}</strong>?
          </center>
          <br>
        </div>
      </form>`;
      await Dialog.confirm({
        title: game.i18n.localize('SWADE.Del'),
        content: template,
        yes: async () => {
          li.slideUp(200, () => this.actor.deleteOwnedItem(ownedItem.id));
        },
        no: () => {},
      });
    });
    //Show Description of an Edge/Hindrance
    html.find('.edge').on('click', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.getOwnedItem(li.data('itemId')).data;
      html.find('#edge-description')[0].innerHTML = TextEditor.enrichHTML(
        item.data.description,
      );
    });
    //Toggle Equipment
    html.find('.item-toggle').on('click', async (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.getOwnedItem(li.data('itemId'));
      await this.actor.updateOwnedItem(
        this._toggleEquipped(li.data('itemId'), item),
      );
      if (item.type === 'armor') {
        await this.actor.update({
          'data.stats.toughness.armor': this.actor.calcArmor(),
        });
      }
    });
    //Toggle Equipmnent Card collapsible
    html.find('.gear-card .card-header .item-name').on('click', (ev) => {
      $(ev.currentTarget)
        .parents('.gear-card')
        .find('.card-content')
        .slideToggle();
    });
    //Input Synchronization
    html.find('.wound-input').on('keyup', (ev) => {
      this.actor.update({
        'data.wounds.value': $(ev.currentTarget).val(),
      });
    });
    html.find('.fatigue-input').on('keyup', (ev) => {
      this.actor.update({
        'data.fatigue.value': $(ev.currentTarget).val(),
      });
    });
    // Roll Skill
    html.find('.skill-label a').on('click', (event) => {
      const element = event.currentTarget;
      const item = element.parentElement.parentElement.dataset.itemId;
      this.actor.rollSkill(item, { event: event });
    });
    // Add new object
    html.find('.item-create').on('click', async (event) => {
      event.preventDefault();
      const header = event.currentTarget;
      const type = header.dataset.type;
      // item creation helper func
      const createItem = function (type, name = `New ${type.capitalize()}`) {
        const itemData = {
          name: name ? name : `New ${type.capitalize()}`,
          type: type,
          data: duplicate(header.dataset),
        };
        delete itemData.data['type'];
        return itemData;
      };
      // Getting back to main logic
      if (type == 'choice') {
        const choices = {};
        header.dataset.choices.split(',').forEach((c) => {
          choices[c] = game.i18n.localize(`ITEM.Type${c.capitalize()}`);
        });
        this._chooseItemType(choices).then(async (dialogInput) => {
          const itemData = createItem(dialogInput.type, dialogInput.name);
          await this.actor.createOwnedItem(itemData, { renderSheet: true });
        });
        return;
      } else {
        const itemData = createItem(type);
        await this.actor.createOwnedItem(itemData, { renderSheet: true });
      }
    });
  }
  getData() {
    const data = super.getData();
    const shields = data.itemsByType['shield'];
    data.parry = 0;
    if (shields) {
      shields.forEach((shield) => {
        if (shield.data['equipped']) {
          data.parry += shield.data['parry'];
        }
      });
    }
    return data;
  }
  _toggleEquipped(id, item) {
    return {
      _id: id,
      data: {
        equipped: !item.data.data.equipped,
      },
    };
  }
}
