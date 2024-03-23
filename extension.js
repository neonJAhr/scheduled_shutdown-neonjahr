const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

function getSettings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    GioSSS.get_default(),
    false
  );
  let schemaObj = schemaSource.lookup('org.gnome.shell.extensions.scheduled_shutdown', true);
  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }
  return new Gio.settings({});
  
}

             
let panelButton, panelButtonText, timeout;

function setButtonText () {
  var arr = [];
  // date
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('date');
  arr.push( out.toString().replace('\n', '') );
  // GEDIT
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('pgrep gedit');
  if (out.length > 0) {
    arr.push('GEDIT');
  }
  // Private (pipeline)
  var [ok, out, err, exit] = GLib.spawn_command_line_sync(
    '/bin/bash -c "ifconfig -a | grep tun0"');
  if (out.length > 0) {
    arr.push('Private');
  }
  // date by JavaScript
  var date = new Date();
  arr.push(date);
  
  // date by GLib
  var now = GLib.DateTime.new_now_local();
  var str = now.format("%H-%M-%S");
  arr.push(str);
  
    
  panelButtonText.set_text( arr.join('  ') );
  return true;
  
}

function init () {
  log('msg1');
  print('msg2');
  printerr('msg3');
  panelButton = new St.Bin({
    style_class : "panel-button"
  });
  
  panelButtonText = new St.Label({
    style_class : "examplePanelText",
    text : "Starting ..."
  });
  
  try {
    throw new Error('msg4');
  } catch (e) {
      logError(e, 'ExtensionError');
      
    }
    
  
  
  panelButton.set_child(panelButtonText);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButton, 1);
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText)
}

function disable() {
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(panelButton);
  
}

