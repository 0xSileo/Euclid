use mopro_ffi::{app, WtnsFn};

rust_witness::witness!(multiplier);

app!();

fn zkey_witness_map(name: &str) -> Result<WtnsFn, MoproError> {
    match name {
        "multiplier_0001.zkey" => Ok(multiplier_witness),
        _ => Err(MoproError::CircomError("Unknown circuit name".to_string())),
    }
}
