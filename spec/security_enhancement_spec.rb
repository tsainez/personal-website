require 'spec_helper'
require 'nokogiri'

describe 'Security Enhancements' do
  let(:site_dir) { '_site' }

  describe 'External Links' do
    it 'should use rel="noopener noreferrer" for target="_blank" links' do
      Dir.glob(File.join(site_dir, '**', '*.html')).each do |file_path|
        doc = Nokogiri::HTML(File.read(file_path))
        links = doc.css('a[target="_blank"]')

        links.each do |link|
          rel = link['rel']
          expect(rel).not_to be_nil, "Link to #{link['href']} in #{file_path} uses target=\"_blank\" but missing rel attribute"
          expect(rel).to include('noopener'), "Link to #{link['href']} in #{file_path} uses target=\"_blank\" but missing 'noopener'"
          expect(rel).to include('noreferrer'), "Link to #{link['href']} in #{file_path} uses target=\"_blank\" but missing 'noreferrer'"
        end
      end
    end
  end

  describe 'Security.txt' do
    it 'should contain Canonical field' do
      file_path = File.join(site_dir, '.well-known', 'security.txt')
      expect(File.exist?(file_path)).to be true
      content = File.read(file_path)
      # Using regex to match the line, allowing for potential surrounding whitespace
      expect(content).to match(/^Canonical: https:\/\/tonysainez\.com\/.well-known\/security\.txt/), "security.txt is missing Canonical field"
    end
  end

  describe 'Frame Busting' do
    it 'should include security.js in head' do
      Dir.glob(File.join(site_dir, '**', '*.html')).each do |file_path|
        doc = Nokogiri::HTML(File.read(file_path))
        script = doc.css('head script[src*="security.js"]')
        expect(script).not_to be_empty, "security.js not found in head of #{file_path}"
      end
    end
  end
end
