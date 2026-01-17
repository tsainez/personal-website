require 'spec_helper'

describe 'Layout Security' do
  it 'escapes the lang attribute in default layout' do
    layout_content = File.read('_layouts/default.html')
    expect(layout_content).to match(/<html lang="{{.*\| escape }}"/)
  end
end
