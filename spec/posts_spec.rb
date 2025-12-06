require 'spec_helper'
require 'yaml'
require 'date'

describe 'Posts' do
  let(:posts_dir) { '_posts' }
  let(:posts) { Dir.glob("#{posts_dir}/*.markdown") }

  it 'has at least one post' do
    expect(posts).not_to be_empty
  end

  it 'all posts have valid front matter' do
    posts.each do |post_file|
      content = File.read(post_file)
      # Split front matter
      parts = content.split(/^---$/)
      expect(parts.size).to be >= 3, "Post #{post_file} does not have valid front matter structure"

      front_matter = YAML.load(parts[1], permitted_classes: [Time, Date])
      expect(front_matter).to be_a(Hash), "Post #{post_file} front matter is not a hash"

      # Check for required fields
      expect(front_matter).to have_key('layout'), "Post #{post_file} missing 'layout'"
      expect(front_matter).to have_key('title'), "Post #{post_file} missing 'title'"
      expect(front_matter).to have_key('date'), "Post #{post_file} missing 'date'"
    end
  end

  it 'all post filenames follow the convention YYYY-MM-DD-title.markdown' do
    posts.each do |post_file|
      filename = File.basename(post_file)
      expect(filename).to match(/^\d{4}-\d{2}-\d{2}-.+\.markdown$/), "Post #{filename} does not follow naming convention"
    end
  end
end
