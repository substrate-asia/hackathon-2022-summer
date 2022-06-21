class Inkcontract < ApplicationRecord
  has_one_attached :file
  has_one_attached :pdf
end
