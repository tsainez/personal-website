require 'spec_helper'

describe 'Security.txt' do
  let(:site_dir) { '_site' }

  it 'should include security.txt in .well-known directory' do
    file_path = File.join(site_dir, '.well-known', 'security.txt')
    expect(File.exist?(file_path)).to be true

    content = File.read(file_path)
    expect(content).to include("Contact: mailto:tsainez@gmail.com")
    expect(content).to include("Expires: 2026-01-01T00:00:00.000Z")
    expect(content).to include("Preferred-Languages: en")
  end
end
