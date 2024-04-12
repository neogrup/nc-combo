import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {AppLocalizeBehavior} from '@polymer/app-localize-behavior/app-localize-behavior.js';

 
class NcCombo extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
  static get template() {
    return html`
      <style>
        paper-dropdown-menu {
          width: 100%;
        }

        paper-item{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 32px 0 16px;
          cursor: pointer;
          --paper-item-selected: {
            background-color: var(--app-secondary-color, #253855);
            color: white;
          };
          --paper-item-focused: {
            background-color: var(--app-secondary-color, #253855);
            color: white;
          };
        }
      </style>
      
      
      <paper-dropdown-menu  id="combo" error-message="{{localize(requiredMessage)}}" label="{{label}}" no-label-float={{noLabelFloat}} selected-item="{{selectedItem}}" selected-item-label="{{selected}}" no-Animations focused>
        <paper-listbox id="menu" slot="dropdown-content" selected="{{value}}" attr-for-selected="value" >
          <template is="dom-if" if="{{translationsLoaded}}">
            <template is="dom-repeat" items="{{comboListData.data}}" as="item">
              <paper-item value="[[_getIdField(item)]]">[[_getDescField(item)]]</paper-item>
            </template>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
    `;
  }
  static get properties() {
    return {
      language: String,
      selectedItem: {
        type: Object,
      },
      comboListData: {
        type: Object,
        value: {},
        observer: '_setComboListData'
      },
      id:{
        type: String
      },
      label: {
        type: String
      },
      noLabelFloat: {
        type: Boolean,
        value: false
      },
      urlTranslate:{
        type: String
      },
      value: {
        type: String,
        value: "",
        notify: true
      },
      codeName: {
        type: Boolean,
        value: false,
        notify: true
      },
      required: {
        type: Boolean,
        observer: '_setRequired',
        value: false
      },
      idField: {
        type: String,
        value: 'code'
      },
      descField: {
        type: String,
        value: 'name'
      },
      loadFirst: {
        type: Boolean,
        value: false
      },
      requiredMessage:{
        type: String
      },
      translationsLoaded: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.useKeyIfMissing = true;

    this.addEventListener('app-localize-resources-loaded', function(e){
      this.translationsLoaded = true;
    }.bind(this));
    this.loadResources(this.resolveUrl(this.urlTranslate));
  }

  _setComboListData(){
    if (!this.comboListData) return;
    if (this.comboListData.data){
      if ((this.comboListData.data.length > 0) && (this.loadFirst) && (this.value == "")){
        this.value = this._getIdField(this.comboListData.data[0]);
        // this.dispatchEvent(new CustomEvent('loaded-first', {detail: this.comboListData.data[0], bbbles: true, composed: true }));
      }

      if ((this.comboListData.data.length == 1) && (this.required)){
        this.value = this._getIdField(this.comboListData.data[0]);
      }
    }
  }

  selectByIndex(index){
    this.value = this._getIdField(this.comboListData.data[0]);
  }

  validate(){
    return this.$.combo.validate();
  }

  _setRequired(required) {
    this.$.combo.toggleAttribute("required", required);
  }

  _getIdField(item) {
    return item[this.idField];
  }

  _getDescField(item) {
    if (this.codeName) {
      return item[this.idField] + ' - ' + this.localize(item[this.descField]);
    } else {
      return this.localize(item[this.descField]);
    }
  }
}

window.customElements.define('nc-combo', NcCombo);
