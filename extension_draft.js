/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

// Use modern imports 
const { GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

function init() {
  super._init(0.0, "Shutdown"); 
    
    // Create UI elements
    this.shutdownTimeItem = new PopupMenu.PopupMenuItem('Set time');
    this.menu.addMenuItem(this.shutdownTimeItem);
    
    let dialog = new ModalDialog.ModalDialog({ 
      title: 'Pick a Time',
      contentLayout: new St.BoxLayout(), // Add time picker elements
    });

    this.shutdownTimeItem.connect('activate', () => {
      dialog.open(); 
    });

    dialog.connect('response', (dialog, time) => {
      this.shutdownTime = time.getTime(); 
    });

    // Check time
    this.timeout = Main.panel.actor.connect('event', () => {
      if (Date.now() >= this.shutdownTime)  
        Util.trySpawnCommandLine('shutdown -h now');
    }); 
}

function enable() {
  Main.panel.addToStatusArea('shutdown', extension); 
}

function disable() {
  extension.destroy();
}
