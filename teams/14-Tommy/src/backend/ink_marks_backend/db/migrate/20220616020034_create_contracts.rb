class CreateContracts < ActiveRecord::Migration[7.0]
  def change
    create_table :contracts do |t|
      t.string :name
      t.string :state

      t.timestamps
    end
  end
end
