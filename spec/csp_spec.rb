require 'spec_helper'
require 'nokogiri'

describe 'Content Security Policy' do
  let(:site_dir) { '_site' }

  it 'should include CSP meta tag in index.html' do
    file_path = File.join(site_dir, 'index.html')
    expect(File.exist?(file_path)).to be true

    doc = Nokogiri::HTML(File.read(file_path))
    csp_meta = doc.at_css('meta[http-equiv="Content-Security-Policy"]')

    expect(csp_meta).not_to be_nil
    content = csp_meta['content']

    expect(content).to include("default-src 'self'")
    expect(content).to include("script-src 'self'")
    expect(content).not_to include("https://www.google-analytics.com")
    expect(content).not_to include("https://www.googletagmanager.com")
    # Verified stricter CSP without unsafe-inline for styles
    expect(content).to include("style-src 'self'")
    expect(content).not_to include("'unsafe-inline'")
    expect(content).to include("img-src 'self' data:")
    expect(content).to include("connect-src 'self'")
    expect(content).to include("frame-src 'none'")
    expect(content).to include("form-action 'none'")
  end

  it 'should include Referrer-Policy meta tag' do
    file_path = File.join(site_dir, 'index.html')
    doc = Nokogiri::HTML(File.read(file_path))
    referrer_meta = doc.at_css('meta[name="referrer"]')

    expect(referrer_meta).not_to be_nil
    expect(referrer_meta['content']).to eq('strict-origin-when-cross-origin')
  end

end
